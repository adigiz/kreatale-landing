"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, LogOut, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { blockAction, deleteAction, signOutAction, unblockAction } from "./actions";

const field = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function UserActions({
  id,
  email,
  blocked,
  locale,
}: {
  id: string;
  email: string;
  blocked: boolean;
  locale: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [dialog, setDialog] = useState<"block" | "delete" | null>(null);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const close = () => {
    setDialog(null);
    setReason("");
    setConfirmText("");
  };

  const block = () =>
    start(async () => {
      const r = await blockAction(id, reason);
      if (!r.ok) return void toast.error(r.error);
      toast.success(`${email} is blocked. Signed out of ${plural(r.data?.sessionsRevoked ?? 0, "session")}.`);
      close();
      router.refresh();
    });

  const unblock = () =>
    start(async () => {
      const r = await unblockAction(id);
      if (!r.ok) return void toast.error(r.error);
      toast.success(`${email} can sign in again.`);
      router.refresh();
    });

  const signOut = () =>
    start(async () => {
      const r = await signOutAction(id);
      if (!r.ok) return void toast.error(r.error);
      toast.success(`Signed out of ${plural(r.data?.sessionsRevoked ?? 0, "session")}.`);
      router.refresh();
    });

  const remove = () =>
    start(async () => {
      const r = await deleteAction(id);
      if (!r.ok) return void toast.error(r.error);
      toast.success(`${email} and their projects are deleted.`);
      close();
      router.replace(`/${locale}/admin/morpheus`);
      router.refresh();
    });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {blocked ? (
          <Button variant="outline" onClick={unblock} disabled={pending}>
            <Undo2 className="size-4" /> Unblock
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setDialog("block")} disabled={pending}>
            <Ban className="size-4" /> Block
          </Button>
        )}
        <Button variant="outline" onClick={signOut} disabled={pending}>
          <LogOut className="size-4" /> Sign out everywhere
        </Button>
        <Button variant="outline" onClick={() => setDialog("delete")} disabled={pending} className="text-red-700 hover:border-red-700">
          <Trash2 className="size-4" /> Delete account
        </Button>
      </div>

      <Dialog open={dialog === "block"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block {email}?</DialogTitle>
            <DialogDescription>
              They&apos;re signed out everywhere and can&apos;t sign in or upload until you unblock them. Their projects stay.
            </DialogDescription>
          </DialogHeader>
          <label className="space-y-1 text-sm">
            <span className="font-medium">
              Reason <span className="font-normal text-muted-foreground">(only the team sees this)</span>
            </span>
            <textarea className={field} rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Uploading other people's sites" />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={block} disabled={pending}>
              {pending ? "Blocking…" : "Block account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {email}?</DialogTitle>
            <DialogDescription>
              This removes the account, its projects and its exports from Morpheus. It can&apos;t be undone. To stop someone using Morpheus
              while keeping their work, block them instead.
            </DialogDescription>
          </DialogHeader>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Type the email to confirm</span>
            <input className={`${field} h-10`} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={remove} disabled={pending || confirmText.trim().toLowerCase() !== email.toLowerCase()} className="bg-red-700 hover:bg-red-800">
              {pending ? "Deleting…" : "Delete for good"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
