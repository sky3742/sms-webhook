import { DeleteMessageButton } from "@/lib/components/DeleteMessageButton";
import { messages } from "@/lib/repo/schema";
import { InferSelectModel } from "drizzle-orm";

type MessagesListProps = {
  messages: Array<InferSelectModel<typeof messages>>;
};

const EmptyMessageState = () => (
  <div className="p-8 text-center text-sm text-gray-500 sm:text-base">
    No messages received yet
  </div>
);

const MessageItem = ({
  id,
  subject,
  message,
  createdAt,
}: InferSelectModel<typeof messages>) => (
  <div className="p-4 hover:bg-gray-50 sm:p-6">
    <div className="flex items-start justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
          {subject || "No subject"}
        </h2>

        <p className="mt-1 text-sm break-words whitespace-pre-wrap text-gray-700 sm:mt-2 sm:text-base">
          {message}
        </p>

        <p className="mt-1 text-xs text-gray-500 sm:mt-3 sm:text-sm">
          Received at: {new Date(createdAt * 1000).toLocaleString()}
        </p>
      </div>

      <DeleteMessageButton id={id} />
    </div>
  </div>
);

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {messages.length === 0 ? (
        <EmptyMessageState />
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <MessageItem key={message.id} {...message} />
          ))}
        </div>
      )}
    </div>
  );
};
