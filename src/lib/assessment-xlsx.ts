import ExcelJS from "exceljs";
import type { SubTopic } from "@/types";

export type ParsedDraft = {
  teachingAssignmentId: string;
  title: string;
  description: string;
  type: "QUIZ" | "EXAM" | "ASSIGNMENT";
  dueAt: string;
  topicId?: string;
};

export type ParsedQuestion = {
  subTopicId: string;
  question: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  points: number;
  order: number;
  options: Array<{ text: string; isCorrect: boolean }>;
};

export type ParseResult = {
  draft: ParsedDraft;
  questions: ParsedQuestion[];
  errors: string[];
};

function cellString(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && "text" in v) return String((v as { text: string }).text).trim();
  if (typeof v === "object" && "result" in v) return String((v as { result: unknown }).result ?? "").trim();
  return String(v).trim();
}

export async function buildAssessmentTemplate(params: {
  draft: ParsedDraft;
  subTopics: SubTopic[];
}): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SchoolHub";
  wb.created = new Date();

  const meta = wb.addWorksheet("Meta");
  meta.columns = [
    { header: "Field", key: "field", width: 28 },
    { header: "Value", key: "value", width: 48 },
  ];
  const header = meta.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };
  header.commit();

  const rows: Array<[string, string]> = [
    ["teachingAssignmentId", params.draft.teachingAssignmentId || ""],
    ["topicId", params.draft.topicId || ""],
    ["title", params.draft.title || ""],
    ["type", params.draft.type || "QUIZ"],
    ["dueAt", params.draft.dueAt || ""],
    ["description", params.draft.description || ""],
  ];
  rows.forEach(([k, v]) => {
    const r = meta.addRow([k, v]);
    r.getCell(1).font = { bold: true, size: 10 };
    r.getCell(2).numFmt = "@";
    r.commit();
  });
  meta.getColumn(1).width = 28;
  meta.getColumn(2).width = 48;

  const lists = wb.addWorksheet("Lists");
  lists.state = "veryHidden";
  lists.getRow(1).values = ["SubTopic Name", "SubTopic ID"];
  lists.getRow(1).font = { bold: true };
  lists.getRow(1).commit();
  params.subTopics.forEach((st) => {
    const r = lists.addRow([st.name, st.id]);
    r.commit();
  });
  lists.getColumn(1).width = 32;
  lists.getColumn(2).width = 36;

  const qs = wb.addWorksheet("Questions");
  const headers = ["No", "SubTopic", "Type", "Question", "Points", "Option A", "Option B", "Option C", "Option D", "Correct (A/B/C/D or True/False)"];
  const hr = qs.addRow(headers);
  hr.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  hr.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  hr.height = 28;
  hr.commit();
  qs.columns = [
    { width: 6 },
    { width: 26 },
    { width: 14 },
    { width: 52 },
    { width: 10 },
    { width: 22 },
    { width: 22 },
    { width: 22 },
    { width: 22 },
    { width: 18 },
  ];
  qs.views = [{ state: "frozen", ySplit: 1 }];
  qs.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 10 } };

  for (let i = 1; i <= 15; i++) {
    const r = qs.addRow([i, "", "MCQ", "", 10, "", "", "", "", ""]);
    r.height = 18;
    r.getCell(3).numFmt = "@";
    r.getCell(5).numFmt = "0";
    r.commit();
  }

  if (params.subTopics.length > 0) {
    const listRange = `'Lists'!$A$2:$A$${params.subTopics.length + 1}`;
    for (let row = 2; row <= 16; row++) {
      qs.getCell(`B${row}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [listRange],
        showErrorMessage: true,
        errorTitle: "Invalid SubTopic",
        error: "Pick from dropdown list",
      };
    }
  }
  for (let row = 2; row <= 16; row++) {
    qs.getCell(`C${row}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ['"MCQ,TRUE_FALSE,SHORT_ANSWER"'],
    };
    qs.getCell(`J${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"A,B,C,D,True,False"'],
    };
  }

  const note = wb.addWorksheet("README");
  note.getColumn(1).width = 100;
  [
    "How to fill:",
    "1) Fill Meta sheet first (title/type/dueAt auto-applied on import). Assignment & Topic IDs pre-filled from download.",
    "2) In Questions sheet: SubTopic must match dropdown (from your class subject). Type MCQ/TRUE_FALSE/SHORT_ANSWER.",
    "3) MCQ: fill A-D and set Correct to A/B/C/D. TRUE_FALSE: set Correct to True/False (A/B also accepted). SHORT_ANSWER: leave options empty.",
    "4) Points default 10. Do not delete header row or rename sheets.",
    "5) Import via button beside Download on Create Assessment page. You can leave and re-import later — file is self-contained.",
  ].forEach((t, i) => {
    const r = note.addRow([t]);
    r.font = i === 0 ? { bold: true, size: 11 } : { size: 10, color: { argb: "FF475569" } };
    r.commit();
  });

  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export async function parseAssessmentWorkbook(file: File): Promise<ParseResult> {
  const wb = new ExcelJS.Workbook();
  const buf = await file.arrayBuffer();
  await wb.xlsx.load(buf);

  const errors: string[] = [];
  const metaWs = wb.getWorksheet("Meta");
  const listsWs = wb.getWorksheet("Lists");
  const qsWs = wb.getWorksheet("Questions");

  if (!qsWs) throw new Error("Invalid template: missing Questions sheet");

  const nameToId = new Map<string, string>();
  if (listsWs) {
    listsWs.eachRow((row, n) => {
      if (n === 1) return;
      const name = cellString(row.getCell(1));
      const id = cellString(row.getCell(2));
      if (name && id) nameToId.set(name.toLowerCase(), id);
      if (name && id) nameToId.set(name, id);
    });
  }

  const draft: ParsedDraft = {
    teachingAssignmentId: "",
    title: "",
    description: "",
    type: "QUIZ",
    dueAt: "",
    topicId: undefined,
  };
  if (metaWs) {
    metaWs.eachRow((row, n) => {
      if (n === 1) return;
      const k = cellString(row.getCell(1));
      const v = cellString(row.getCell(2));
      if (!k) return;
      if (k === "teachingAssignmentId") draft.teachingAssignmentId = v;
      else if (k === "topicId") draft.topicId = v || undefined;
      else if (k === "title") draft.title = v;
      else if (k === "type" && (v === "QUIZ" || v === "EXAM" || v === "ASSIGNMENT")) draft.type = v;
      else if (k === "dueAt") draft.dueAt = v;
      else if (k === "description") draft.description = v;
    });
  }

  const questions: ParsedQuestion[] = [];
  qsWs.eachRow((row, n) => {
    if (n === 1) return;
    const subTopicName = cellString(row.getCell(2));
    const rawType = cellString(row.getCell(3)).toUpperCase();
    const qText = cellString(row.getCell(4));
    const rawPoints = cellString(row.getCell(5));
    const optA = cellString(row.getCell(6));
    const optB = cellString(row.getCell(7));
    const optC = cellString(row.getCell(8));
    const optD = cellString(row.getCell(9));
    const correctRaw = cellString(row.getCell(10));

    if (!qText) return;

    const type: ParsedQuestion["type"] =
      rawType === "TRUE_FALSE" || rawType === "SHORT_ANSWER" || rawType === "MCQ"
        ? (rawType as ParsedQuestion["type"])
        : "MCQ";

    let subTopicId = "";
    if (subTopicName) {
      subTopicId = nameToId.get(subTopicName) ?? nameToId.get(subTopicName.toLowerCase()) ?? "";
      if (!subTopicId) errors.push(`Row ${n}: SubTopic "${subTopicName}" not found in Lists — set manually or re-download template`);
    } else {
      errors.push(`Row ${n}: missing SubTopic`);
    }

    const points = rawPoints ? Number(rawPoints) : 10;
    if (!Number.isFinite(points) || points <= 0) errors.push(`Row ${n}: invalid points "${rawPoints}"`);

    let options: ParsedQuestion["options"] = [];
    if (type === "SHORT_ANSWER") {
      options = [];
    } else if (type === "TRUE_FALSE") {
      const norm = correctRaw.toLowerCase();
      const isTrue = norm === "true" || norm === "a" || norm === "t";
      options = [
        { text: "True", isCorrect: isTrue },
        { text: "False", isCorrect: !isTrue },
      ];
    } else {
      const opts = [optA, optB, optC, optD];
      const correct = correctRaw.toUpperCase();
      const idx = ["A", "B", "C", "D"].indexOf(correct);
      if (correct && idx === -1) errors.push(`Row ${n}: Correct must be A/B/C/D`);
      if (opts.filter(Boolean).length < 2) errors.push(`Row ${n}: MCQ needs >=2 options`);
      options = (["A", "B", "C", "D"] as const).map((letter, i) => ({
        text: opts[i] || `Option ${letter}`,
        isCorrect: i === (idx >= 0 ? idx : 0),
      }));
    }

    questions.push({
      subTopicId,
      question: qText,
      type,
      points: Number.isFinite(points) && points > 0 ? points : 10,
      order: questions.length,
      options,
    });
  });

  return { draft, questions, errors };
}
