import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteConfirmationDialogProps = {
  title: string;
  description: string;
  pending: boolean;
  onConfirm: () => Promise<void>;
};

export function DeleteConfirmationDialog({
  title,
  description,
  pending,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={(
          <Button type="button" variant="destructive" className="h-11 rounded-xl px-4 text-sm" />
        )}
      >
        <Trash2 /> Löschen
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>
            Abbrechen
          </DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending ? "Wird gelöscht …" : "Endgültig löschen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
