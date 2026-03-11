export const dynamic = "force-dynamic";

import { ApiEndpointInfo } from "@/lib/components/ApiEndpointInfo";
import { AutoRefreshOnRevisit } from "@/lib/components/AutoRefreshOnRevisit";
import { LogoutButton } from "@/lib/components/LogoutButton";
import { MessagesList } from "@/lib/components/MessagesList";
import { NotificationButton } from "@/lib/components/NotificationButton";
import { NotificationStatusInline } from "@/lib/components/NotificationStatusInline";
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
    <div className="mx-auto max-w-md space-y-5 px-4 py-6">
      <AutoRefreshOnRevisit />

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">SMS Webhook Dashboard</h1>
          <LogoutButton />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <NotificationStatusInline />
          <span>•</span>
          <span>Total messages: {count}</span>
        </div>
      </div>

      <NotificationButton />

      <div className="border-t border-gray-200" />

      <MessagesList messages={messages} />

      <div className="border-t border-gray-200" />

      <ApiEndpointInfo />
    </div>
  );
}
