import { InferSelectModel } from "drizzle-orm";
import { messages } from "../repo/schema";
import { DeleteMessageButton } from "./DeleteMessageButton";

type MessagesListProps = {
  messages: Array<InferSelectModel<typeof messages>>;
};

export const MessagesList = ({ messages }: MessagesListProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* {error && (
        <div className="p-4 text-center text-red-500 text-sm sm:text-base">
          Error: {error}
        </div>
      )} */}

      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm sm:text-base">
          No messages received yet
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 sm:p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  {/* Subject */}
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {msg.subject || "No subject"}
                  </h2>

                  {/* Message */}
                  <p className="text-sm sm:text-base text-gray-700 mt-1 sm:mt-2 whitespace-pre-wrap wrap-break-word">
                    {msg.message}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-3">
                    Received at:{" "}
                    {new Date(msg.createdAt * 1000).toLocaleString()}
                  </p>
                </div>

                {/* Delete Icon */}
                <DeleteMessageButton id={msg.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
