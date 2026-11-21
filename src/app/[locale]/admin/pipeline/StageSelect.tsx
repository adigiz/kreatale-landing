"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STAGES, STAGE_LABELS, LOST_REASONS, LOST_REASON_LABELS } from "@/lib/pipeline/constants";
import { changeStageAction } from "./actions";

export default function StageSelect({ dealId, stage, compact = false }: { dealId: string; stage: string; compact?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [askLost, setAskLost] = useState(false);
  const [reason, setReason] = useState<string>("no-response");
  const [note, setNote] = useState("");

  const move = (to: string, lostReason?: string, lostNote?: string) =>
    start(async () => {
      const res = await changeStageAction(dealId, to, lostReason, lostNote);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`Moved to ${STAGE_LABELS[to as keyof typeof STAGE_LABELS]}`);
      router.refresh();
    });

  return (
    <>
      <select
        aria-label="Stage"
        value={stage}
        disabled={pending}
        onChange={(e) => {
          const to = e.target.value;
          if (to === "lost") setAskLost(true);
          else move(to);
        }}
        className={`w-full rounded-md border bg-background ${compact ? "h-7 px-1.5 text-xs" : "h-9 px-2 text-sm"}`}
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {compact ? `Move to: ${STAGE_LABELS[s]}` : STAGE_LABELS[s]}
          </option>
        ))}
      </select>

      <Dialog open={askLost} onOpenChange={setAskLost}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why was it lost?</DialogTitle>
            <DialogDescription>This keeps the win rate honest and shows what to fix.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              {LOST_REASONS.map((r) => (
                <option key={r} value={r}>{LOST_REASON_LABELS[r]}</option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything worth remembering (optional)"
              rows={3}
              className="w-full rounded-md border bg-background p-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAskLost(false)}>Cancel</Button>
            <Button
              disabled={pending}
              onClick={() => {
                setAskLost(false);
                move("lost", reason, note);
              }}
            >
              Mark as lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
