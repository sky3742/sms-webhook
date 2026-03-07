export const ApiEndpointInfo = () => {
  return (
    <div className="mt-6 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_24px_64px_-38px_rgba(16,33,58,0.35)]">
      <h3 className="mb-2 text-sm font-semibold text-[#12365e] sm:text-base">
        Webhook Endpoint
      </h3>
      <code className="rounded bg-[#e5f0ff] px-2 py-1 text-xs text-[#0e5cad] sm:text-sm">
        POST /api/webhook
      </code>
      <p className="mt-2 text-xs text-[#4d6283] sm:text-sm">
        Custom forwarder payload:{" "}
        <code className="rounded bg-[#e5f0ff] px-1">
          {JSON.stringify({ sender: "+1234567890", message: "Hello" })}
        </code>
      </p>
      <p className="mt-1 text-xs text-[#4d6283] sm:text-sm">
        Optional header:{" "}
        <code className="rounded bg-[#e5f0ff] px-1">X-Webhook-Token</code>
      </p>
    </div>
  );
};
