"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function UploadResumeButton() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    setFileName(file.name)
    toast.success(`Resume uploaded: ${file.name}`)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="h-10 gap-2 rounded-md px-4 text-[13px]"
      >
        <Upload className="size-3.5" />
        {fileName ? "Replace Resume" : "Upload Resume"}
      </Button>
    </>
  )
}
