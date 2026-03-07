import { DeleteMessageButton } from "@/lib/components/DeleteMessageButton";
import { messages } from "@/lib/repo/schema";
import { InferSelectModel } from "drizzle-orm";

type MessagesListProps = {
  messages: Array<InferSelectModel<typeof messages>>;
};

const EmptyMessageState = () => (
  <div className="rounded-2xl border border-white/70 bg-white/75 p-8 text-center text-sm text-[#65748f] shadow-[0_24px_64px_-38px_rgba(16,33,58,0.4)] sm:text-base">
    No messages received yet
  </div>
);

const MessageItem = ({
  id,
  subject,
  message,
  createdAt,
}: InferSelectModel<typeof messages>) => (
  <div className="p-4 transition hover:bg-[#f3f8ff] sm:p-6">
    <div className="flex items-start justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-[#10213a] sm:text-lg">
          {subject || "No subject"}
        </h2>

        <p className="mt-1 text-sm break-words whitespace-pre-wrap text-[#3f4e66] sm:mt-2 sm:text-base">
          {message}
        </p>

        <p className="mt-2 text-xs text-[#7a879e] sm:mt-3 sm:text-sm">
          Received at: {new Date(createdAt * 1000).toLocaleString()}
        </p>
      </div>

      <DeleteMessageButton id={id} />
    </div>
  </div>
);

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_24px_64px_-38px_rgba(16,33,58,0.4)] backdrop-blur">
      {messages.length === 0 ? (
        <EmptyMessageState />
      ) : (
        <div className="divide-y divide-[#deebff]">
          {messages.map((message) => (
            <MessageItem key={message.id} {...message} />
          ))}
        </div>
      )}
    </div>
  );
};
