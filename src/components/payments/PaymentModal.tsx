import { CurrencyService } from "@/lib/payments/CurrencyService";
import { useState } from "react";
import { X } from "lucide-react";
import { PaymentService } from "@/lib/payments/PaymentService";

type PaymentModalProps = {
  open: boolean;
  price: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
};

const paymentMethods = [
  "M-Pesa Kenya",
  "Airtel Money Kenya",
  "MTN Mobile Money",
  "Airtel Money Uganda",
  "M-Pesa Tanzania",
  "Airtel Money Tanzania",
  "Visa",
];

export default function PaymentModal({
  open,
  price,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (!open) return null;

  const handleMpesaPayment = async () => {
  if (!phoneNumber.trim()) {
    alert("Please enter your M-Pesa phone number.");
    return;
  }

  let interval: ReturnType<typeof setInterval> | null = null;
  let firstCheckTimeout: ReturnType<typeof setTimeout> | null = null;

  try {
    setIsProcessing(true);

    const usdAmount = Number(price.replace(/[^\d.]/g, ""));
    const amountKES = CurrencyService.usdToKes(usdAmount);

    console.log("Payment price =", price);
    console.log("USD amount =", usdAmount);
    console.log("Amount sent to M-Pesa (KES) =", amountKES);

    const response = await PaymentService.sendMpesaSTKPush({
      phoneNumber,
      amount: amountKES,
    });

    setStatusMessage(
      "📱 STK Push sent. Please complete the payment on your phone..."
    );

    const checkoutRequestID = response.CheckoutRequestID;

    const checkPaymentStatus = async () => {
      try {
        const result = await PaymentService.checkMpesaPayment(
          checkoutRequestID
        );

        console.log("M-Pesa payment status:", result);

        // ✅ Payment successful
        if (result.paid) {
          if (interval) clearInterval(interval);
          if (firstCheckTimeout) clearTimeout(firstCheckTimeout);

          setStatusMessage("✅ Payment confirmed!");
          setIsProcessing(false);

          onPaymentSuccess();
          onClose();

          return;
        }

        // ⏳ Still waiting for payment
        if ((result as any).pending) {
          setStatusMessage(
            "📱 Waiting for payment confirmation..."
          );

          return;
        }

        // ❌ User cancelled
        if ((result as any).cancelled) {
          if (interval) clearInterval(interval);
          if (firstCheckTimeout) clearTimeout(firstCheckTimeout);

          setStatusMessage("❌ Payment cancelled.");
          setIsProcessing(false);

          return;
        }

        // ❌ Payment failed or timed out
        if ((result as any).failed) {
          if (interval) clearInterval(interval);
          if (firstCheckTimeout) clearTimeout(firstCheckTimeout);

          setStatusMessage(
            (result as any).message ??
              "❌ Payment failed. Please try again."
          );

          setIsProcessing(false);

          return;
        }

        // If the backend has not confirmed anything yet,
        // continue waiting.
        setStatusMessage(
          "📱 Waiting for payment confirmation..."
        );
      } catch (err) {
        // IMPORTANT:
        // Do not stop the payment process because of one
        // temporary verification error.
        console.warn(
          "M-Pesa verification temporarily unavailable:",
          err
        );

        setStatusMessage(
          "📱 Waiting for payment confirmation..."
        );
      }
    };

    // Give the customer 10 seconds to receive the STK
    // prompt and enter their M-Pesa PIN.
    firstCheckTimeout = setTimeout(() => {
      checkPaymentStatus();
    }, 10000);

    // Continue checking every 5 seconds.
    interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000);

  } catch (err) {
    console.error("STK Push failed:", err);

    alert("Failed to initiate M-Pesa payment.");

    setIsProcessing(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">
            ✨ Ready to Generate
          </h3>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-300">
          Create your image for <strong>{price}</strong>
        </p>

        <h4 className="mt-5 text-sm font-extrabold">
          Choose Payment Method
        </h4>

        <div className="mt-4 max-h-[320px] overflow-y-auto space-y-3 pr-1">
          {paymentMethods.map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`w-full rounded-2xl border px-4 py-3 text-left font-bold transition ${
                selectedMethod === method
                  ? "border-cyan-400 bg-cyan-900/30"
                  : "border-white/10 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {method}
            </button>
          ))}

          {selectedMethod === "M-Pesa Kenya" && (
            <div className="mt-5 space-y-4">
              <input
                type="tel"
                placeholder="2547XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />

              <button
                disabled={isProcessing}
                onClick={handleMpesaPayment}
                className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {isProcessing
                  ? "Waiting for Payment..."
                  : "Send STK Push"}
              </button>
            </div>
          )}
        </div>

        {statusMessage && (
          <div className="mt-5 rounded-xl bg-slate-800 p-3 text-sm text-cyan-300">
            {statusMessage}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="mt-5 w-full rounded-2xl bg-slate-700 py-3 font-bold hover:bg-slate-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
