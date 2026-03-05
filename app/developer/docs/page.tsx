export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">API Documentation</h1>
        <p className="text-gray-500 mt-2">
          Everything you need to integrate NexaPay payments into your application.
        </p>
      </div>

      {/* Base URL */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">Base URL</h2>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-green-400">
          https://yourdomain.com/api
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">Authentication</h2>
        <p className="text-gray-500 text-sm mb-4">
          All API requests must include your API key in the{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 text-xs">
            Authorization
          </code>{" "}
          header. You can find your API key in the{" "}
          <span className="text-blue-500 font-medium">API Keys</span> section.
        </p>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300">
          <span className="text-blue-400">Authorization</span>:{" "}
          <span className="text-green-400">npk_live_your_api_key_here</span>
        </div>
      </section>

      {/* Endpoint 1 — Initialize Payment */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          Initialize a Payment
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            POST
          </span>
          <code className="font-mono text-sm text-gray-700">
            /api/notchpay/initialize
          </code>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Creates a new payment and returns an{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 text-xs">
            authorization_url
          </code>{" "}
          that you redirect the user to for completing payment.
        </p>

        {/* Request body */}
        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Request Body</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Field</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Type</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Required</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { field: "amount", type: "number", req: "Yes", desc: "Amount to charge in smallest currency unit" },
                { field: "currency", type: "string", req: "Yes", desc: "Currency code e.g. XAF, USD" },
                { field: "name", type: "string", req: "Yes", desc: "Customer full name" },
                { field: "phone", type: "string", req: "Yes", desc: "Customer phone number" },
                { field: "channel", type: "string", req: "Yes", desc: "Payment channel: Orange Money, MTN Mobile Money" },
              ].map((row) => (
                <tr key={row.field} className="bg-white">
                  <td className="px-4 py-3 font-mono text-blue-600 text-xs">{row.field}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.type}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.req === "Yes" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                      {row.req}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Response */}
        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Success Response</h3>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300">
          {`{\n  "authorization_url": "https://pay.notchpay.co/pay/trx_xxx",\n  "transaction": {\n    "reference": "trx_xxx",\n    "status": "pending",\n    "amount": 5000,\n    "currency": "XAF"\n  }\n}`}
        </div>
      </section>

      {/* Endpoint 2 — Verify Payment */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          Verify a Payment
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            GET
          </span>
          <code className="font-mono text-sm text-gray-700">
            /api/notchpay/verify?reference=trx_xxx
          </code>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Verifies the status of a payment using its reference. This is called
          automatically when the user is redirected back to your callback URL.
          The result is also saved to your database.
        </p>

        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Query Parameters</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Parameter</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Type</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-3 font-mono text-blue-600 text-xs">reference</td>
                <td className="px-4 py-3 text-gray-500 text-xs">string</td>
                <td className="px-4 py-3 text-gray-500 text-xs">The transaction reference returned by NotchPay</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Success Response</h3>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300">
          {`{\n  "transaction": {\n    "reference": "trx_xxx",\n    "status": "complete",\n    "amount": 5000,\n    "currency": "XAF",\n    "customer": {\n      "name": "John Doe",\n      "phone": "699123456"\n    }\n  }\n}`}
        </div>
      </section>

      {/* Error Codes */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">Error Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Code</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { code: "200", meaning: "Success" },
                { code: "400", meaning: "Bad request — missing or invalid parameters" },
                { code: "401", meaning: "Unauthorized — invalid or missing API key" },
                { code: "404", meaning: "Not found — transaction reference does not exist" },
                { code: "500", meaning: "Internal server error" },
                { code: "502", meaning: "Could not reach payment provider" },
              ].map((row) => (
                <tr key={row.code} className="bg-white">
                  <td className="px-4 py-3 font-mono text-red-500 text-xs font-bold">{row.code}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}