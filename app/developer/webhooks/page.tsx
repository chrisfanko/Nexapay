export default function WebhooksPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900">Webhooks</h1>
        <p className="text-gray-500 mt-2">
          Webhooks let NexaPay notify your server in real time when a payment
          succeeds or fails — without your user needing to stay on the page.
        </p>
      </div>

      {/* What is a webhook */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          What is a Webhook?
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          A webhook is an HTTP request that NexaPay sends to a URL you specify
          whenever a payment event occurs. Instead of your app constantly asking
          "did the payment go through?", NexaPay proactively tells your server
          the moment something happens.
        </p>
      </section>

      {/* How to set up */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">How to Set Up</h2>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Create a webhook endpoint in your app",
              description:
                "Add a POST route in your app that will receive the webhook payload from NexaPay.",
            },
            {
              step: "02",
              title: "Set your callback URL",
              description:
                "In your initialize payment request, set the callback field to your endpoint URL e.g. https://yourdomain.com/api/webhooks/notchpay",
            },
            {
              step: "03",
              title: "Handle the payload",
              description:
                "Parse the incoming JSON payload, check the transaction status, and update your database accordingly.",
            },
            {
              step: "04",
              title: "Return a 200 response",
              description:
                "Always return a 200 status code to acknowledge receipt. If NexaPay doesn't get a 200, it will retry the webhook.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{item.step}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Webhook endpoint example */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          Example Webhook Endpoint
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Create this file in your Next.js app at{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 text-xs">
            app/api/webhooks/notchpay/route.ts
          </code>
        </p>
        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-700">
            <span className="text-xs text-zinc-400 font-medium">TypeScript</span>
          </div>
          <pre className="px-5 py-4 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { transaction } = payload;

    if (!transaction) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (transaction.status === "complete") {
      // Payment succeeded — update your DB, send confirmation email, etc.
      console.log("Payment complete:", transaction.reference);
    } else {
      // Payment failed or was cancelled
      console.log("Payment failed:", transaction.reference);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}`}
          </pre>
        </div>
      </section>

      {/* Payload structure */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          Webhook Payload Structure
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          This is what NexaPay sends to your endpoint when a payment event occurs:
        </p>

        <h3 className="text-sm font-semibold text-zinc-900 mb-2">
          Payment Complete
        </h3>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
{`{
  "transaction": {
    "reference": "trx.xxx",
    "status": "complete",
    "amount": 5000,
    "currency": "XAF",
    "channel": "Orange Money",
    "customer": {
      "name": "John Doe",
      "phone": "699123456"
    }
  }
}`}
        </div>

        <h3 className="text-sm font-semibold text-zinc-900 mb-2">
          Payment Failed
        </h3>
        <div className="bg-zinc-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300 overflow-x-auto">
{`{
  "transaction": {
    "reference": "trx.xxx",
    "status": "failed",
    "amount": 5000,
    "currency": "XAF",
    "channel": "MTN Mobile Money",
    "message": "Insufficient funds",
    "customer": {
      "name": "Jane Doe",
      "phone": "677123456"
    }
  }
}`}
        </div>
      </section>

      {/* Important notes */}
      <section>
        <h2 className="text-xl font-bold text-zinc-900 mb-3">
          Important Notes
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-2">
          {[
            "Always return a 200 status code to prevent NexaPay from retrying the webhook.",
            "Validate the payload before processing to avoid handling malformed data.",
            "Your webhook endpoint must be publicly accessible — localhost URLs will not work in production.",
            "For testing, use a tool like ngrok to expose your local server to the internet.",
          ].map((note, i) => (
            <div key={i} className="flex gap-2 text-sm text-yellow-800">
              <span className="shrink-0">⚠️</span>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}