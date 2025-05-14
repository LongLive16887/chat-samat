"use client"

import type React from "react"

// Hooks from shadcn/ui
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        toasts.forEach((toast) => {
          if (toast.id === toastId && toastTimeouts.has(toastId)) {
            clearTimeout(toastTimeouts.get(toastId))
            toastTimeouts.delete(toastId)
          }
        })
        return toasts.filter((t) => t.id !== toastId)
      }
      return []
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()

      const newToast = {
        ...props,
        id,
        duration: props.duration || 5000,
      }

      setToasts((prevToasts) => {
        const nextToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)
        return nextToasts
      })

      const timeout = setTimeout(() => {
        dismiss(id)
      }, newToast.duration)

      toastTimeouts.set(id, timeout)

      return id
    },
    [dismiss],
  )

  useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
      toastTimeouts.clear()
    }
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
