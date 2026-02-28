export const ApiEndpointInfo = () => {
  return (
    <div className="mt-6 rounded-lg bg-blue-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-blue-900 sm:text-base">
        Webhook Endpoint
      </h3>
      <code className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 sm:text-sm">
        POST /api/webhook
      </code>
      <p className="mt-2 text-xs text-blue-700 sm:text-sm">
        SMS Forwarder sends:{" "}
        <code className="rounded bg-blue-100 px-1">
          {JSON.stringify({ subject: "Example", message: "Hello" })}
        </code>
      </p>
    </div>
  );
};
