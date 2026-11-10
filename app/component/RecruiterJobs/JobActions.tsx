import { MoreVertical, Pencil } from "lucide-react"

import { DeleteJobDialog } from "@/app/component/RecruiterDashboard/DeleteJobDialog"
import { Button } from "@/components/ui/button"
import type { JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

export function JobActions({
  job,
  onUpdate,
  onDelete,
  onMore,
  className,
  updateClassName,
}: {
  job: JobPost
  onUpdate: (job: JobPost) => void
  onDelete: (id: string) => void
  onMore: (job: JobPost) => void
  className?: string
  updateClassName?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 gap-1.5 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-300",
          updateClassName
        )}
        onClick={() => onUpdate(job)}
      >
        <Pencil className="size-3.5" />
        Update
      </Button>

      <DeleteJobDialog job={job} onDeleted={onDelete} />

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`More actions for ${job.title}`}
        onClick={() => onMore(job)}
      >
        <MoreVertical className="size-4" />
      </Button>
    </div>
  )
}
