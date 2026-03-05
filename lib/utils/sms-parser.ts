// SMS Forwarder Message Parser
// Handles parsing of messages from SMS Forwarder

export interface SmsForwarderMessage {
  subject: string;
  message: string;
}

export interface ParsedSmsMessage {
  sender: string;
  content: string;
  token?: string;
}

/**
 * Extract phone number digits from a string
 * Handles formats like: +60123456789, +60 123 456 789, ++12 345 67890, 60123456789
 */
function extractPhoneDigits(text: string): string {
  // Remove all non-digit characters
  const digits = text.replace(/\D/g, "");
  return digits;
}

function parseSubjectKv(subject: string): Record<string, string> {
  const entries = subject
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [key, ...rest] = part.split("=");
      return [key?.trim().toLowerCase(), rest.join("=").trim()] as const;
    })
    .filter(([key, value]) => key && value);

  return Object.fromEntries(entries);
}

function normalizeContent(input: string): string {
  return input.replace(/<br\s*\/?>/gi, "\n").trim();
}

function parseLegacyContent(input: string): string {
  const contentMatch = input.match(
    /<br\s*\/?>\s*Message:\s*(.+?)(?:\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}\s*[AP]M\)|$)/i,
  );

  const content = contentMatch ? contentMatch[1] : input;
  return normalizeContent(content).replace(
    /\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}\s*[AP]M\)\s*$/i,
    "",
  );
}

/**
 * Preferred template format (subject):
 * sender=%s|token=YOUR_STATIC_TOKEN
 *
 * Message:
 * %m
 *
 * Falls back to previous SMS Forwarder formats for compatibility.
 */
export function parseSmsMessage(body: SmsForwarderMessage): ParsedSmsMessage {
  const subject = String(body.subject || "").trim();
  const rawMessage = String(body.message || "");
  const message = normalizeContent(rawMessage);

  // Fast path for simple templates.
  const subjectFields = parseSubjectKv(subject);
  const templateSender = subjectFields.sender || subjectFields.s;
  const templateToken = subjectFields.token;

  if (templateSender || templateToken) {
    return {
      sender: templateSender || subject || "Unknown Sender",
      content: message,
      token: templateToken,
    };
  }

  // Secondary compact format: "<sender>|<token>"
  const compactMatch = subject.match(/^(.+?)\|([^|]+)$/);
  if (compactMatch) {
    return {
      sender: compactMatch[1].trim(),
      content: message,
      token: compactMatch[2].trim(),
    };
  }

  // Backward-compatible legacy parsing.
  const cleanMessage = rawMessage.replace(/<br\s*\/?>/gi, " ");
  const phoneMatch = cleanMessage
    .replace(/\s/g, "")
    .replace(/\+\+/g, "+")
    .match(/Incoming-[\+]?(\d{8,15})/);

  let sender = subject;
  if (phoneMatch?.[1]) {
    sender = "+" + extractPhoneDigits(phoneMatch[1]);
  } else {
    const subjectDigits = extractPhoneDigits(subject);
    if (subjectDigits.length >= 8) {
      sender = "+" + subjectDigits;
    }
  }

  return {
    sender: sender || "Unknown Sender",
    content: parseLegacyContent(rawMessage).trim(),
  };
}

/**
 * Format phone number for display
 * @param phoneNumber Phone number (may have leading +)
 * @returns Formatted phone number with + prefix
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // First, remove any duplicate plus signs and extra characters
  let cleaned = phoneNumber.replace(/\+\+/g, "+");
  // Extract only digits
  cleaned = cleaned.replace(/[^0-9]/g, "");

  // If empty after cleaning, return original
  if (!cleaned) {
    return phoneNumber;
  }

  return "+" + cleaned;
}
