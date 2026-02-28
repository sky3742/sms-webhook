import { ApiEndpointInfo } from "@/lib/components/ApiEndpointInfo";
import { MessagesList } from "@/lib/components/MessagesList";
import { NotificationButton } from "@/lib/components/NotificationButton";
import { NotificationStatusAnnoucement } from "@/lib/components/NotificationStatusAnnoucement";
import { RefreshButton } from "@/lib/components/RefreshButton";
import { getAllMessages, getMessageCount } from "@/lib/services/message";

export default async function Dashboard() {
  const messages = await getAllMessages(50);
  const count = await getMessageCount();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <NotificationStatusAnnoucement />

        {/* <div
          className={`mb-6 p-4 rounded-lg border ${status.bgColor} ${status.textColor}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{status.icon}</span>
            <p className="text-sm sm:text-base">{status.message}</p>
          </div>
        </div> */}

        {/* Header with Refresh Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              SMS Webhook Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
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
