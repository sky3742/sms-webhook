import { ApiEndpointInfo } from "@/lib/components/ApiEndpointInfo";
import { MessagesList } from "@/lib/components/MessagesList";
import { NotificationButton } from "@/lib/components/NotificationButton";
import { NotificationStatusAnnouncement } from "@/lib/components/NotificationStatusAnnouncement";
import { RefreshButton } from "@/lib/components/RefreshButton";
import { getAllMessages, getMessageCount } from "@/lib/services/message";

export default async function Dashboard() {
  const [messages, count] = await Promise.all([
    getAllMessages(50),
    getMessageCount(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <NotificationStatusAnnouncement />

        {/* Header with Refresh Button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              SMS Webhook Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Total messages received: {count}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <RefreshButton />
            <NotificationButton />
          </div>
        </div>

        <MessagesList messages={messages} />

        <ApiEndpointInfo />
      </div>
    </div>
  );
}
