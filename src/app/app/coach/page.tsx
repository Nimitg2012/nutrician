"use client";

import { AppShell } from "@/components/app/shell";
import { Button, Card, PageIntro } from "@/components/ui";
import { useToday } from "@/lib/hooks";
import { analyzeDay } from "@/lib/services/nutritionAI";
import { useNutrician } from "@/lib/store";
import { useState } from "react";

const PROMPTS = [
  "What should I eat for dinner?",
  "Why is my score low?",
  "How can I increase protein?",
  "Give me a high-protein vegetarian lunch.",
  "I have 500 calories left. What can I eat?",
  "What nutrients am I missing this week?",
];

export default function CoachPage() {
  const { ctx } = useToday();
  const chat = useNutrician((s) => s.chat);
  const sendChat = useNutrician((s) => s.sendChat);
  const applyCoachAction = useNutrician((s) => s.applyCoachAction);
  const addWater = useNutrician((s) => s.addWater);
  const setLogOpen = useNutrician((s) => s.setLogOpen);
  const [text, setText] = useState("");
  const noticed = analyzeDay(ctx).slice(0, 3);

  const send = (value: string) => {
    if (!value.trim()) return;
    sendChat(value.trim());
    setText("");
  };

  return (
    <AppShell>
      <PageIntro
        kicker="Nutrician Intelligence"
        title="Coach"
        body="Intelligence first. Chat second. Answers use your logged meals. This is coaching, not a medical diagnosis."
      />
      <h2 className="text-lg font-semibold">3 things I noticed today</h2>
      {noticed.length === 0 ? (
        <p className="mt-3 text-sm text-muted">You&apos;re looking great today. No major issues detected.</p>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {noticed.map((item) => (
            <Card key={item.id}>
              <p className="font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
              {item.cta ? (
                <Button href={item.cta.href} variant="secondary" className="mt-4">
                  {item.cta.label}
                </Button>
              ) : item.id.includes("water") ? (
                <Button className="mt-4" onClick={() => addWater(2)}>
                  Fix hydration
                </Button>
              ) : (
                <Button className="mt-4" variant="secondary" onClick={() => setLogOpen(true)}>
                  Fix protein
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
      <h2 className="mt-10 text-lg font-semibold">Ask a follow-up</h2>
      <div className="mt-3 mb-4 flex flex-wrap gap-2">
        {PROMPTS.map((item) => (
          <button key={item} type="button" className="rounded-full bg-white/5 px-3 py-1.5 text-xs" onClick={() => send(item)}>
            {item}
          </button>
        ))}
      </div>
      <Card className="min-h-[320px] space-y-3">
        {chat.length === 0 ? (
          <p className="text-sm text-muted">Ask about dinner, protein, or today&apos;s score. Nutrician Intelligence is temporarily quiet until you send a question.</p>
        ) : null}
        {chat.map((message) => (
          <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "ml-auto bg-accent/15" : "bg-white/5"}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.actions?.map((action) => (
              <Button key={action.id} variant="secondary" className="mt-2" onClick={() => applyCoachAction(message.id, action.id)}>
                {action.label}
              </Button>
            ))}
          </div>
        ))}
      </Card>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(text);
        }}
      >
        <input
          className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask Nutrician…"
        />
        <Button type="submit">Send</Button>
      </form>
    </AppShell>
  );
}
