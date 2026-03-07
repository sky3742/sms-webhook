import { AutoRefreshOnRevisit } from "@/lib/components/AutoRefreshOnRevisit";
import { ApiEndpointInfo } from "@/lib/components/ApiEndpointInfo";
import { LogoutButton } from "@/lib/components/LogoutButton";
import { MessagesList } from "@/lib/components/MessagesList";
import { NotificationButton } from "@/lib/components/NotificationButton";
import { NotificationStatusAnnouncement } from "@/lib/components/NotificationStatusAnnouncement";
import { RefreshButton } from "@/lib/components/RefreshButton";
import { getSession } from "@/lib/services/auth";
import { getAllMessages, getMessageCount } from "@/lib/services/message";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [messages, count] = await Promise.all([
    getAllMessages(50),
    getMessageCount(),
  ]);

  return (
    <div className="min-h-screen">
      <AutoRefreshOnRevisit />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <NotificationStatusAnnouncement />

        <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_24px_64px_-38px_rgba(16,33,58,0.45)] backdrop-blur sm:p-7">
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#0e5cad] uppercase">
              Secure Inbox
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#10213a] sm:text-4xl">
              SMS Webhook Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#4f5f7a] sm:text-base">
              Total messages received: {count}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
            <RefreshButton />
            <NotificationButton />
            <LogoutButton />
          </div>
        </div>

        <MessagesList messages={messages} />

        <ApiEndpointInfo />
      </div>
    </div>
  );
}
