export const dynamic = "force-dynamic";

import { ApiEndpointInfo } from "@/lib/components/ApiEndpointInfo";
import { AutoRefreshOnRevisit } from "@/lib/components/AutoRefreshOnRevisit";
import { LogoutButton } from "@/lib/components/LogoutButton";
import { MessagesList } from "@/lib/components/MessagesList";
import { NotificationButton } from "@/lib/components/NotificationButton";
import { NotificationStatusInline } from "@/lib/components/NotificationStatusInline";
import { PullToRefresh } from "@/lib/components/PullToRefresh";
import { getSession } from "@/lib/services/auth";
import { getAllMessages, getMessageCount } from "@/lib/services/message";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [messages, count] = await Promise.all([
    getAllMessages(5),
    getMessageCount(),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <AutoRefreshOnRevisit />
      <PullToRefresh />

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">SMS Webhook</h1>
        <div className="flex items-center gap-3">
          <NotificationButton />
          <LogoutButton />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <NotificationStatusInline />
        <span aria-hidden="true">·</span>
        <span>{count} messages</span>
      </div>

      <div className="mt-4">
        <MessagesList messages={messages} totalCount={count} />
      </div>

      <div className="mt-6">
        <ApiEndpointInfo />
      </div>
    </div>
  );
}
