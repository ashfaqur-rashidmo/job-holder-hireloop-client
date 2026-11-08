"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { deleteJob } from "@/lib/actions/jobs"

type DeleteJobDialogProps = {
  job: {
    _id: string
    title: string
  }
  onDeleted: (id: string) => void
}

export function DeleteJobDialog({ job, onDeleted }: DeleteJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const res = await deleteJob(job._id)

      console.log("Deleting job:", job._id, res)

      if (res.success) {
        toast.success("Job deleted", {
          description: `The job "${job.title}" has been deleted.`,
        })

        // Tell the parent page to update its jobs state.
        onDeleted(job._id)

        setIsOpen(false)
      } else {
        toast.error(res.message || "Failed to delete job")
      }
    } catch (error) {
      console.error("Delete error:", error)

      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon"
            aria-label={`Delete ${job.title}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        }
      />

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>Delete job?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete &quot;{job.title}&quot;? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
