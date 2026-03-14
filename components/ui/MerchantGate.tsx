"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, XCircle, Building2, Loader } from "lucide-react";

interface MerchantStatus {
  merchantStatus: "unverified" | "pending" | "approved" | "rejected";
  business?: {
    companyName: string;
    businessType: string;
    country: string;
    registeredAt: string;
  };
  rejectionReason?: string;
}

export default function MerchantGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<MerchantStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/merchant/status")
      .then((res) => {
        if (res.status === 401) {
          router.push("/sign-in");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStatus(data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  // Not registered yet
  if (status?.merchantStatus === "unverified") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">
            Register Your Business First
          </h2>
          <p className="text-gray-500 mb-6">
            To access API keys, webhooks, and the developer portal, you need to register your business and get approved.
          </p>
          <Link
            href="/register-business"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition inline-block"
          >
            Register Business →
          </Link>
        </div>
      </div>
    );
  }

  // Pending approval
  if (status?.merchantStatus === "pending") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">
            Application Under Review
          </h2>
          <p className="text-gray-500 mb-4">
            Your business application for{" "}
            <strong>{status.business?.companyName}</strong> is currently being
            reviewed by our team.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-yellow-700 font-medium mb-1">What happens next?</p>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>✓ We review your business details</li>
              <li>✓ Approval usually takes 24-48 hours</li>
              <li>✓ You will get full API access once approved</li>
            </ul>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Rejected
  if (status?.merchantStatus === "rejected") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">
            Application Rejected
          </h2>
          <p className="text-gray-500 mb-4">
            Unfortunately your business application was not approved.
          </p>
          {status.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-red-700 font-medium mb-1">Reason:</p>
              <p className="text-sm text-red-600">{status.rejectionReason}</p>
            </div>
          )}
          <Link
            href="/register-business"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition inline-block mb-3"
          >
            Reapply →
          </Link>
          <br />
          <Link href="/dashboard" className="text-sm text-gray-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Approved — render children normally
  return <>{children}</>;
}