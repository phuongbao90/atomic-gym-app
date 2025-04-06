// apps/expo-app/src/services/telegramLogger.ts
export async function sendErrorToTelegram(
  error: Error | string,
  additionalInfo: Record<string, unknown> = {}
) {
  try {
    const botToken = process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN
    const chatId = process.env.EXPO_PUBLIC_TELEGRAM_LOG_CHAT_ID

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured")
      return
    }

    const errorMessage = typeof error === "string" ? error : error.message
    const stackTrace =
      typeof error === "string" ? "" : error.stack || "No stack trace"

    const text = `
  🚨 Expo App Error 🚨
      
  Error: ${errorMessage}
      
  Stack Trace:
  ${stackTrace}
      
  Additional Info:
  ${JSON.stringify(additionalInfo, null, 2)}
      `

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })

    if (!response.ok) {
      console.error("Telegram API error:", await response.text())
    }
  } catch (telegramError) {
    console.error("Failed to send error to Telegram:", telegramError)
  }
}
