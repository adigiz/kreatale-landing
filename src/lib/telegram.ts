// Sends a message to the team's Telegram chat. Configured with TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID; text uses Telegram's HTML subset (escape user input with escapeHtml).

const TIMEOUT_MS = 5000;

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/** Returns false when Telegram isn't configured; throws when the API rejects the message. */
export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html.length > 4000 ? html.slice(0, 4000) + "…" : html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Telegram ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  }
  return true;
}
