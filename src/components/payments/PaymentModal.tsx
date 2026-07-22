import { useState } from "react";
import { X } from "lucide-react";

type PaymentModalProps = {
  open: boolean;
  price: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onMpesaPayment: (phoneNumber: string) => Promise<void>;
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
  onMpesaPayment,
}: PaymentModalProps) {
  if (!open) return null;
const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
const [phoneNumber, setPhoneNumber] = useState("");
const [isProcessing, setIsProcessing] = useState(false);
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
          Create your image for {price}
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
      onClick={async () => {
        if (!phoneNumber.trim()) {
          alert("Please enter your M-Pesa phone number.");
          return;
        }

        try {
          setIsProcessing(true);

          await onMpesaPayment(phoneNumber);

          onPaymentSuccess();
        } finally {
          setIsProcessing(false);
        }
      }}
      className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
    >
      {isProcessing ? "Sending STK Push..." : "Send STK Push"}
    </button>
  </div>
)}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-slate-700 py-3 font-bold hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
