import { DeleteMessageButton } from "@/lib/components/DeleteMessageButton";
import { messages } from "@/lib/repo/schema";
import { InferSelectModel } from "drizzle-orm";

type MessagesListProps = {
  messages: Array<InferSelectModel<typeof messages>>;
};

const EmptyMessageState = () => (
  <div className="py-10 text-center text-gray-500">No SMS received yet</div>
);

const MessageItem = ({
  id,
  subject,
  message,
  createdAt,
}: InferSelectModel<typeof messages>) => {
  const timestamp = new Date(createdAt * 1000).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="truncate font-semibold text-gray-800">
          📩 {subject || "Unknown Sender"}
        </p>
        <DeleteMessageButton id={id} />
      </div>

      <p className="mt-2 text-sm text-gray-700">{message}</p>

      <p className="mt-3 text-xs text-gray-400">{timestamp}</p>
    </div>
  );
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <EmptyMessageState />
      ) : (
        messages.map((message) => <MessageItem key={message.id} {...message} />)
      )}
    </div>
  );
};
