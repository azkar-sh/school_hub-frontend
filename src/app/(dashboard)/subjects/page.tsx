'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Layers, BookmarkCheck } from 'lucide-react';

export default function SubjectsPage() {
  const mockSubjects = [
    {
      id: 's1',
      name: 'Mathematics',
      code: 'MATH-101',
      topics: [
        { name: 'Linear Equations & Algebra', subTopics: ['Solving 1-Var Equations', 'Systems of Equations', 'Quadratic Formulas'] },
        { name: 'Geometry & Trigonometry', subTopics: ['Pythagorean Theorem', 'Sine & Cosine Laws', 'Circle Properties'] },
      ],
    },
    {
      id: 's2',
      name: 'Physics',
      code: 'PHYS-201',
      topics: [
        { name: 'Classical Mechanics', subTopics: ['Newton Laws of Motion', 'Kinematics & Velocity', 'Work & Kinetic Energy'] },
        { name: 'Thermodynamics', subTopics: ['Heat Transfer', 'Entropy & Enthalpy', 'Ideal Gas Law'] },
      ],
    },
    {
      id: 's3',
      name: 'Biology',
      code: 'BIOL-102',
      topics: [
        { name: 'Cellular Biology', subTopics: ['Structure of Organelles', 'Mitosis & Meiosis', 'ATP Energy Cycle'] },
        { name: 'Genetics & DNA', subTopics: ['Mendelian Inheritance', 'DNA Replication', 'Gene Expression'] },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Subjects & Topic Hierarchy</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore curriculum breakdown, topics, and subtopics</p>
      </div>

      <div className="space-y-6">
        {mockSubjects.map((sub) => (
          <Card key={sub.id} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{sub.name}</CardTitle>
                    <Badge variant="outline">{sub.code}</Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">{sub.topics.length} Major Topics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sub.topics.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{t.name}</span>
                    </div>
                    <div className="pl-6 space-y-1 text-xs text-muted-foreground">
                      {t.subTopics.map((st, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
