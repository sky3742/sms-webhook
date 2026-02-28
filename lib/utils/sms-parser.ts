// SMS Forwarder Message Parser
// Handles parsing of messages from SMS Forwarder

export interface SmsForwarderMessage {
  subject: string;
  message: string;
}

export interface ParsedSmsMessage {
  sender: string;
  content: string;
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

/**
 * Parse SMS Forwarder message
 * SMS Forwarder format:
 * - subject: "You have a new SMS at the number SIM 2"
 * - message: "Incoming - +1234567890 (Contact undefined) <br/>Message: Actual SMS content (2/27/26 6:36 PM)"
 *
 * @param message Raw message from SMS Forwarder webhook
 * @returns Parsed message with sender as title
 */
export function parseSmsMessage(
  message: SmsForwarderMessage,
): ParsedSmsMessage {
  // Extract phone number from message field
  let sender = "";

  // First, remove HTML tags to get clean text
  const cleanMessage = message.message.replace(/<br\s*\/?>/gi, " ");

  // Remove spaces and duplicate plus signs for phone extraction
  // e.g., "++12 345 67890" -> "+1234567890"
  const noSpaces = cleanMessage.replace(/\s/g, "");
  const noDoublePlus = noSpaces.replace(/\+\+/g, "+");

  // Look for phone pattern after "Incoming-" in the cleaned version
  const phoneMatch = noDoublePlus.match(/Incoming-[\+]?(\d{8,15})/);

  if (phoneMatch && phoneMatch[1]) {
    const digits = extractPhoneDigits(phoneMatch[1]);
    // Need at least 8 digits for a valid phone number
    if (digits.length >= 8) {
      sender = "+" + digits;
    }
  }

  // If no phone in message, try to find any phone-like pattern in the original message
  if (!sender) {
    // Look for any 8-15 digit sequence in the clean message
    const anyPhoneMatch = cleanMessage.match(/(\d{8,15})/);
    if (anyPhoneMatch) {
      sender = "+" + anyPhoneMatch[1];
    }
  }

  // If still no phone, try subject
  if (!sender) {
    const subjectDigits = extractPhoneDigits(message.subject);
    if (subjectDigits.length >= 8) {
      sender = "+" + subjectDigits;
    } else {
      sender = message.subject;
    }
  }

  // Extract actual SMS content from message field
  // Format: "... <br/>Message: Actual content (2/27/26 6:36 PM)"
  const contentMatch = message.message.match(
    /<br\s*\/?>\s*Message:\s*(.+?)(?:\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}\s*[AP]M\)|$)/i,
  );

  // Get actual message content
  let content = contentMatch ? contentMatch[1] : message.message;

  // Clean up HTML line breaks
  content = content.replace(/<br\s*\/?>/gi, "\n").trim();

  // Remove trailing date/time pattern like "(2/27/26 6:36 PM)"
  content = content
    .replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}\s*[AP]M\)\s*$/i, "")
    .trim();

  return {
    sender: sender || "Unknown Sender",
    content,
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
