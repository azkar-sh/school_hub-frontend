import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export interface GuideRow {
  label: string;
  value: string;
  detail?: string;
  href?: string;
}

export function GuideResourcePage({
  title,
  description,
  rows,
  action,
  demo = true,
}: {
  title: string;
  description: string;
  rows: GuideRow[];
  action?: { label: string; href?: string };
  demo?: boolean;
}) {
  const t = useTranslations("Common.GuideResource");

  return (
    <div className="space-y-6">
      {demo && <DemoModeBanner />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Learn Hub
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {action &&
          (action.href ? (
            <Link href={action.href}>
              <Button variant="role">
                <PlusCircle className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button variant="role">
              <PlusCircle className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ))}
      </div>
      <Card>
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-base">
            {t("recordsInView", { count: rows.length })}
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 p-0">
          {rows.map((row) => {
            const content = (
              <div className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{row.label}</p>
                  {row.detail && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.detail}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="outline">{row.value}</Badge>
                  {row.href && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
            return row.href ? (
              <Link key={`${row.label}-${row.value}`} href={row.href}>
                {content}
              </Link>
            ) : (
              <div key={`${row.label}-${row.value}`}>{content}</div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
