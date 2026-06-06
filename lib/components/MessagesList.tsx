"use client";

import { PAGE_SIZE } from "@/lib/constants";
import { DeleteMessageButton } from "@/lib/components/DeleteMessageButton";
import { loadMessages } from "@/lib/services/message-actions";
import { messages } from "@/lib/repo/schema";
import { InferSelectModel } from "drizzle-orm";
import { useState, useTransition, memo } from "react";

type Message = InferSelectModel<typeof messages>;

type MessagesListProps = {
  messages: Message[];
  totalCount: number;
};

const MessageItem = memo(({
  message,
  isExpanded,
  onToggle,
}: {
  message: Message;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const timestamp = message.createdAt.toLocaleString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-semibold text-gray-800">
          {message.subject || "Unknown Sender"}
        </p>
        <DeleteMessageButton id={message.id} />
      </div>

      <button
        className={`mt-1 w-full text-left text-sm text-gray-600 ${isExpanded ? "" : "line-clamp-2"}`}
        onClick={onToggle}
        type="button"
      >
        {message.message}
      </button>

      <p
        className="mt-1 text-xs text-gray-400"
        suppressHydrationWarning
      >
        {timestamp}
      </p>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export const MessagesList = ({
  messages: initialMessages,
  totalCount,
}: MessagesListProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialMessages.length < totalCount,
  );
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextMessages = await loadMessages(page, PAGE_SIZE);
      if (nextMessages.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setMessages((prev) => [...prev, ...nextMessages]);
      setPage((prev) => prev + 1);
    });
  };

  return (
    <div className="divide-y divide-gray-200">
      {messages.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No SMS received yet
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isExpanded={expandedId === message.id}
            onToggle={() => handleToggle(message.id)}
          />
        ))
      )}

      {hasMore && (
        <button
          className="w-full py-2 text-sm font-medium text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
          onClick={handleLoadMore}
          type="button"
        >
          {isPending ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
};
