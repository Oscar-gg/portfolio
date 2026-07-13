import * as React from "react";

import { cn } from "~/utils/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-quaternary/30 bg-tertiary px-3 py-2 text-sm text-secondary ring-offset-background placeholder:text-quaternary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palette-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
