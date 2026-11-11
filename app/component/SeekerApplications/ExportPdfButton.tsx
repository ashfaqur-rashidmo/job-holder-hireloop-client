"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ExportPdfButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="h-10 gap-2 rounded-md px-4 text-[13px]"
    >
      <Download className="size-3.5" />
      Export PDF
    </Button>
  )
}
