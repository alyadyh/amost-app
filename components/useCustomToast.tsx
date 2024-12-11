'use client'
import { Toast, ToastTitle, useToast } from "./ui/toast"

/**
 * Custom Hook: useCustomToast
 * Provides a reusable toast notification functionality.
 */
export function useCustomToast() {
  const toast = useToast()

  return (message: string, variant: "success" | "error" | "warning" | "info") =>
    toast.show({
      placement: "top",
      render: ({ id }: { id: string }) => (
        <Toast nativeID={id} variant="solid" action={variant}>
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    }
  )
}
