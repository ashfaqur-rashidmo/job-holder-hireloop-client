import * as React from "react"
import * as SeparatorPrimitive from "@base-ui/react/separator"
import { cn } from "cn"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Separator>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <SeparatorPrimitive.Separator
    ref={ref}
    orientation={orientation}
    className={cn(
      "shrink-0 border-border",
      orientation === "vertical" ? "h-[0.875rem] w-px" : "h-px w-[0.875rem]",
      className
    )}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }
