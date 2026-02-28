export const ApiEndpointInfo = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
        Webhook Endpoint
      </h3>
      <code className="text-xs sm:text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
        POST /api/webhook
      </code>
      <p className="text-xs sm:text-sm text-blue-700 mt-2">
        SMS Forwarder sends:{" "}
        <code className="bg-blue-100 px-1 rounded">
          {JSON.stringify({ subject: "Example", message: "Hello" })}
        </code>
      </p>
    </div>
  );
};
