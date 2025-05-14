"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "default">("default")

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        new Notification("Уведомления включены!", {
          body: "Теперь вы будете получать уведомления о новых сообщениях",
          icon: "/icon.png",
        })
      }
    }
  }

  if (permission === "granted" || !("Notification" in window)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={requestPermission}
        className="flex items-center gap-2 shadow-lg"
        variant={permission === "denied" ? "destructive" : "default"}
      >
        {permission === "denied" ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {permission === "denied" ? "Уведомления заблокированы" : "Включить уведомления"}
      </Button>
    </div>
  )
}
