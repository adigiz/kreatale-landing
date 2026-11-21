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
import DealForm, { type DealFormValues } from "../DealForm";
import { addNoteAction, deleteDealAction, setFollowUpAction } from "../actions";

export function FollowUpPicker({ dealId, value }: { dealId: string; value: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const save = (date: string | null) =>
    start(async () => {
      const res = await setFollowUpAction(dealId, date);
      if (!res.ok) return void toast.error(res.error);
      toast.success(date ? "Follow-up set" : "Follow-up cleared");
      router.refresh();
    });
  const inDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return (
    <div className="space-y-2">
      <input
        type="date"
        defaultValue={value ?? ""}
        key={value ?? "none"}
        disabled={pending}
        onChange={(e) => save(e.target.value || null)}
        className="h-9 w-full rounded-md border bg-background px-2 text-sm"
      />
      <div className="flex flex-wrap gap-1">
        {[["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7]].map(([l, n]) => (
          <button key={l} type="button" disabled={pending} onClick={() => save(inDays(n as number))} className="rounded border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent">
            {l}
          </button>
        ))}
        {value && (
          <button type="button" disabled={pending} onClick={() => save(null)} className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:underline">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export function NoteBox({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await addNoteAction(dealId, text);
          if (!res.ok) return void toast.error(res.error);
          setText("");
          router.refresh();
        });
      }}
      className="space-y-2"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Add a note: a call summary, what they said, next steps"
        className="w-full rounded-md border bg-background p-2.5 text-sm"
      />
      <Button type="submit" size="sm" disabled={pending || !text.trim()}>Add note</Button>
    </form>
  );
}

export function EditDeal(props: {
  dealId: string;
  initial: DealFormValues;
  owners: { id: string; name: string | null; email: string }[];
  canValue: boolean;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit details</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit deal</DialogTitle>
          </DialogHeader>
          <DealForm mode="edit" {...props} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DeleteDeal({ dealId, locale }: { dealId: string; locale: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-muted-foreground hover:text-red-600">
        Delete deal
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this deal?</DialogTitle>
            <DialogDescription>
              The deal and its timeline are removed for good. The original enquiry stays in the Inbox.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteDealAction(dealId);
                  if (!res.ok) return void toast.error(res.error);
                  toast.success("Deal deleted");
                  router.push(`/${locale}/admin/pipeline`);
                })
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
