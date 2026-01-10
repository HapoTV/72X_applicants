import * as React from "react"
import * as primitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const ToastProvider = primitives.Provider

const Toast = React.forwardRef<
  React.ElementRef<typeof primitives.Root>,
  React.ComponentPropsWithoutRef<typeof primitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <ToastProvider>
      <primitives.Root
        ref={ref}
        className={cn("bg-background border border-border text-foreground shadow-md", className)}
        {...props}
      />
    </ToastProvider>
  )
})
Toast.displayName = primitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof primitives.Action>,
  React.ComponentPropsWithoutRef<typeof primitives.Action>
>(({ className, ...props }, ref) => (
  <primitives.Action ref={ref} className={cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent p-0 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className)} {...props} />
))

ToastAction.displayName = primitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof primitives.Close>,
  React.ComponentPropsWithoutRef<typeof primitives.Close>
>(({ className, ...props }, ref) => (
  <primitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </primitives.Close>
))

ToastClose.displayName = primitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof primitives.Title>,
  React.ComponentPropsWithoutRef<typeof primitives.Title>
>(({ className, ...props }, ref) => (
  <primitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))

ToastTitle.displayName = primitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof primitives.Description>,
  React.ComponentPropsWithoutRef<typeof primitives.Description>
>(({ className, ...props }, ref) => (
  <primitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))

ToastDescription.displayName = primitives.Description.displayName

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof primitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof primitives.Viewport>
>(({ className, ...props }, ref) => (
  <primitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = primitives.Viewport.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof primitives.Root> & {
  variant?: "default" | "destructive"
}

type ToastActionElement = React.ReactElement<
  React.ComponentPropsWithoutRef<typeof primitives.Action>
>

export {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastViewport,
}

export type { ToastProps, ToastActionElement }
