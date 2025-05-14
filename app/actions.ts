"use server"

// Имитация отправки сообщения
export async function sendMessage(message: { id: string; text: string; sender: string; timestamp: number }) {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log("Message sent:", message)

  return { success: true }
}
