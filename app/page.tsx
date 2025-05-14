"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, Download, MessageCircle } from "lucide-react"
import { sendMessage } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { NotificationPermission } from "@/components/notification-permission"

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
}

// Имитация автоматических ответов
const AUTO_RESPONSES = [
  "Привет! Как дела?",
  "Интересно, расскажи подробнее.",
  "Я понимаю, о чем ты говоришь.",
  "Это действительно интересная тема!",
  "Согласен с тобой полностью.",
  "Хммм, надо подумать об этом.",
  "Отличная идея!",
  "Не уверен, что это хорошая мысль.",
  "Можешь рассказать больше?",
  "Звучит здорово!",
]

// Имена ботов для автоответов
const BOT_NAMES = ["Анна", "Иван", "Мария", "Алексей", "Елена"]

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [username, setUsername] = useState("")
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // PWA install prompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
    })

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is already installed")
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Инициализация демо-сообщений
  useEffect(() => {
    if (username && !showUsernamePrompt) {
      const demoMessages = [
        {
          id: "1",
          text: "Привет! Добро пожаловать в чат!",
          sender: "Система",
          timestamp: Date.now() - 60000,
        },
        {
          id: "2",
          text: `Привет, ${username}! Как дела?`,
          sender: "Анна",
          timestamp: Date.now() - 30000,
        },
      ]
      setMessages(demoMessages)
    }
  }, [username, showUsernamePrompt])

  // Функция для генерации автоматического ответа
  const generateAutoResponse = () => {
    // Случайный выбор ответа и имени бота
    const responseText = AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)]
    const botName = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]

    // Создание сообщения-ответа
    const responseMessage: Message = {
      id: Date.now().toString(),
      text: responseText,
      sender: botName,
      timestamp: Date.now(),
    }

    // Добавление ответа с задержкой для имитации печатания
    setTimeout(
      () => {
        setMessages((prevMessages) => [...prevMessages, responseMessage])

        // Показываем уведомление, если страница не активна
        if (document.hidden) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Новое сообщение от ${botName}`, {
              body: responseText,
              icon: "/icon.png",
            })
          }
        }
      },
      1000 + Math.random() * 2000,
    ) // Случайная задержка от 1 до 3 секунд
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: username,
      timestamp: Date.now(),
    }

    // Добавляем сообщение локально
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput("")

    // Имитация отправки сообщения
    try {
      await sendMessage(newMessage)

      // Генерируем автоматический ответ
      generateAutoResponse()
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive",
        duration: 5000,
      })
      console.error("Error sending message:", error)
    }
  }

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setShowUsernamePrompt(false)
    }
  }

  const installApp = async () => {
    if (!deferredPrompt) {
      console.log("Can't find prompt event")
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (showUsernamePrompt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center">
            <div className="w-16 h-16 mb-4 text-primary">
              <MessageCircle className="w-full h-full" />
            </div>
            <CardTitle className="text-center">Добро пожаловать в чат</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetUsername} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Введите ваше имя
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти в чат
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-xs text-gray-500">Автор: Отеулиев Самат</CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Чат в реальном времени</h1>
          </div>
          <div className="flex items-center gap-2">
            {deferredPrompt && (
              <Button onClick={installApp} variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Установить приложение</span>
                <span className="sm:hidden">Установить</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 max-w-4xl w-full mx-auto">
        <Card className="h-full flex flex-col">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Общий чат
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === username ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex ${message.sender === username ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className={message.sender === "Система" ? "bg-gray-500" : ""}>
                      {message.sender.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.sender === username
                        ? "bg-primary text-primary-foreground"
                        : message.sender === "Система"
                          ? "bg-gray-300 text-gray-800"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.sender !== username && <div className="text-xs font-medium mb-1">{message.sender}</div>}
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${message.sender === username ? "text-primary-foreground/70" : "text-gray-500"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-white p-3 text-center text-xs text-gray-500 shadow-sm">
        Автор: Отеулиев Самат &copy; {new Date().getFullYear()}
      </footer>

      <NotificationPermission />
    </div>
  )
}
