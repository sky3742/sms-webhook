export const ApiEndpointInfo = () => {
  return (
    <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <summary className="cursor-pointer font-medium text-gray-700">
        Developer Settings
      </summary>
      <div className="mt-3 space-y-3 text-sm text-gray-700">
        <div>
          <p className="font-medium text-gray-900">Webhook Endpoint</p>
          <code className="mt-3 block overflow-x-auto rounded-md bg-gray-900 p-3 text-sm text-gray-100">
            POST /api/webhook
          </code>
        </div>
        <div>
          <p className="font-medium text-gray-900">Payload Example</p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-gray-900 p-3 text-sm text-gray-100">
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
          <p className="font-medium text-gray-900">Optional Header</p>
          <code className="mt-3 block overflow-x-auto rounded-md bg-gray-900 p-3 text-sm text-gray-100">
            X-Webhook-Token
          </code>
        </div>
      </div>
    </details>
  );
};
