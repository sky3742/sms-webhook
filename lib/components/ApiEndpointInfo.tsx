export const ApiEndpointInfo = () => {
  return (
    <details className="text-xs text-gray-400">
      <summary className="cursor-pointer transition-colors hover:text-gray-600">
        Developer Settings
      </summary>
      <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div>
          <p className="font-medium text-gray-700">Webhook Endpoint</p>
          <code className="mt-1 block overflow-x-auto rounded bg-gray-900 p-2 text-xs text-gray-100">
            POST /api/webhook
          </code>
        </div>
        <div>
          <p className="font-medium text-gray-700">Payload Example</p>
          <pre className="mt-1 overflow-x-auto rounded bg-gray-900 p-2 text-xs text-gray-100">
            {JSON.stringify(
              {
                sender: "+1234567890",
                message: "Hello",
              },
              null,
              2,
            )}
          </pre>
        </div>
        <div>
          <p className="font-medium text-gray-700">Optional Header</p>
          <code className="mt-1 block overflow-x-auto rounded bg-gray-900 p-2 text-xs text-gray-100">
            X-Webhook-Token
          </code>
        </div>
      </div>
    </details>
  );
};
