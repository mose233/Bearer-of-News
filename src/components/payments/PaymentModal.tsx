import { CurrencyService } from "@/lib/payments/CurrencyService";
import { useEffect, useRef, useState } from "react";
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

  /*
   * ------------------------------------------------------------
   * PAYMENT POLLING PROTECTION
   * ------------------------------------------------------------
   *
   * These refs are intentionally outside handleMpesaPayment().
   *
   * This is important because the polling callbacks continue
   * running after handleMpesaPayment() has returned.
   */

  // Prevent onPaymentSuccess() from executing more than once
  // for the same payment.
  const paymentHandledRef = useRef(false);

  // Prevent two M-Pesa status requests from running at once.
  const checkingPaymentRef = useRef(false);

  // Keep references to the active timers.
  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const firstCheckTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * ------------------------------------------------------------
   * STOP ALL PAYMENT POLLING
   * ------------------------------------------------------------
   */
  const stopPolling = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (firstCheckTimeoutRef.current !== null) {
      clearTimeout(firstCheckTimeoutRef.current);
      firstCheckTimeoutRef.current = null;
    }
  };

  /*
   * ------------------------------------------------------------
   * CLEAN UP WHEN COMPONENT IS UNMOUNTED
   * ------------------------------------------------------------
   */
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * RESET PAYMENT STATE WHEN MODAL OPENS
   * ------------------------------------------------------------
   *
   * Every time the modal is opened for a NEW payment attempt,
   * the duplicate-success protection is reset.
   */
  useEffect(() => {
    if (open) {
      stopPolling();

      paymentHandledRef.current = false;
      checkingPaymentRef.current = false;

      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [open]);

  /*
   * ------------------------------------------------------------
   * M-PESA PAYMENT
   * ------------------------------------------------------------
   */
  const handleMpesaPayment = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    /*
     * Never start another STK Push while one is already
     * being processed.
     */
    if (isProcessing) {
      console.log(
        "⛔ M-Pesa payment already processing. Ignoring duplicate click."
      );
      return;
    }

    /*
     * Clean up any old polling before starting a new payment.
     */
    stopPolling();

    /*
     * Reset guards for this NEW payment.
     */
    paymentHandledRef.current = false;
    checkingPaymentRef.current = false;

    try {
      setIsProcessing(true);

      const usdAmount = Number(price.replace(/[^\d.]/g, ""));

      const amountKES = CurrencyService.usdToKes(usdAmount);

      console.log("=================================");
      console.log("M-PESA PAYMENT");
      console.log("Payment price =", price);
      console.log("USD amount =", usdAmount);
      console.log("Amount sent to M-Pesa (KES) =", amountKES);
      console.log("=================================");

      /*
       * ----------------------------------------------------------
       * SEND STK PUSH
       * ----------------------------------------------------------
       */
      const response = await PaymentService.sendMpesaSTKPush({
        phoneNumber,
        amount: amountKES,
      });

      console.log("M-Pesa STK response:", response);

      const checkoutRequestID = response.CheckoutRequestID;

      if (!checkoutRequestID) {
        throw new Error(
          "M-Pesa did not return a CheckoutRequestID."
        );
      }

      setStatusMessage(
        "📱 STK Push sent. Please complete the payment on your phone..."
      );

      /*
       * ----------------------------------------------------------
       * CHECK PAYMENT STATUS
       * ----------------------------------------------------------
       */
      const checkPaymentStatus = async () => {
        /*
         * --------------------------------------------------------
         * PROTECTION #1
         *
         * Payment has already been handled.
         *
         * Absolutely nothing else should happen.
         * --------------------------------------------------------
         */
        if (paymentHandledRef.current) {
          console.log(
            "⛔ Payment already handled. Ignoring status check."
          );

          return;
        }

        /*
         * --------------------------------------------------------
         * PROTECTION #2
         *
         * A previous status request is still running.
         *
         * Do not create another overlapping request.
         * --------------------------------------------------------
         */
        if (checkingPaymentRef.current) {
          console.log(
            "⏳ Payment status check already running. Skipping."
          );

          return;
        }

        checkingPaymentRef.current = true;

        try {
          const result =
            await PaymentService.checkMpesaPayment(
              checkoutRequestID
            );

          console.log(
            "M-Pesa payment status:",
            result
          );

          /*
           * ------------------------------------------------------
           * PAYMENT SUCCESS
           * ------------------------------------------------------
           */
          if (result.paid) {
            /*
             * DOUBLE-CHECK.
             *
             * Another request may have completed while this
             * request was waiting for the backend.
             */
            if (paymentHandledRef.current) {
              console.log(
                "⛔ Duplicate payment success ignored."
              );

              return;
            }

            /*
             * VERY IMPORTANT:
             *
             * Lock the payment BEFORE calling onPaymentSuccess().
             *
             * This means any other polling callback that receives
             * paid=true after this point will be rejected.
             */
            paymentHandledRef.current = true;

            console.log(
              "================================="
            );
            console.log(
              "✅ PAYMENT CONFIRMED"
            );
            console.log(
              "🔒 Payment success locked"
            );
            console.log(
              "🚀 Executing onPaymentSuccess ONCE"
            );
            console.log(
              "================================="
            );

            /*
             * STOP ALL FUTURE POLLING IMMEDIATELY.
             */
            stopPolling();

            setStatusMessage(
              "✅ Payment confirmed!"
            );

            setIsProcessing(false);

            /*
             * ----------------------------------------------------
             * THIS MUST RUN ONLY ONCE.
             *
             * The parent component is responsible for executing
             * the pendingGeneration callback.
             * ----------------------------------------------------
             */
            onPaymentSuccess();

            /*
             * Close the payment modal.
             */
            onClose();

            return;
          }

          /*
           * ------------------------------------------------------
           * PAYMENT STILL PENDING
           * ------------------------------------------------------
           */
          if ((result as any).pending) {
            setStatusMessage(
              "📱 Waiting for payment confirmation..."
            );

            return;
          }

          /*
           * ------------------------------------------------------
           * PAYMENT CANCELLED
           * ------------------------------------------------------
           */
          if ((result as any).cancelled) {
            console.log(
              "❌ M-Pesa payment cancelled."
            );

            stopPolling();

            setStatusMessage(
              "❌ Payment cancelled."
            );

            setIsProcessing(false);

            return;
          }

          /*
           * ------------------------------------------------------
           * PAYMENT FAILED
           * ------------------------------------------------------
           */
          if ((result as any).failed) {
            console.log(
              "❌ M-Pesa payment failed."
            );

            stopPolling();

            setStatusMessage(
              (result as any).message ??
                "❌ Payment failed. Please try again."
            );

            setIsProcessing(false);

            return;
          }

          /*
           * ------------------------------------------------------
           * UNKNOWN / NOT YET CONFIRMED
           * ------------------------------------------------------
           */
          setStatusMessage(
            "📱 Waiting for payment confirmation..."
          );
        } catch (err) {
          /*
           * ------------------------------------------------------
           * TEMPORARY VERIFICATION ERROR
           *
           * Do NOT immediately cancel the customer's payment.
           * The next polling cycle can try again.
           * ------------------------------------------------------
           */
          console.warn(
            "M-Pesa verification temporarily unavailable:",
            err
          );

          /*
           * If payment has not already been handled, continue
           * waiting.
           */
          if (!paymentHandledRef.current) {
            setStatusMessage(
              "📱 Waiting for payment confirmation..."
            );
          }
        } finally {
          checkingPaymentRef.current = false;
        }
      };

      /*
       * ----------------------------------------------------------
       * FIRST PAYMENT CHECK
       * ----------------------------------------------------------
       *
       * Give the customer 10 seconds to:
       *
       * 1. Receive the STK Push
       * 2. Enter their M-Pesa PIN
       */
      firstCheckTimeoutRef.current = setTimeout(() => {
        if (paymentHandledRef.current) {
          return;
        }

        checkPaymentStatus();
      }, 10000);

      /*
       * ----------------------------------------------------------
       * CONTINUOUS PAYMENT CHECK
       * ----------------------------------------------------------
       *
       * Check every 5 seconds.
       *
       * checkingPaymentRef prevents overlapping requests.
       *
       * paymentHandledRef prevents duplicate success handling.
       */
      intervalRef.current = setInterval(() => {
        if (paymentHandledRef.current) {
          stopPolling();
          return;
        }

        checkPaymentStatus();
      }, 5000);
    } catch (err) {
      console.error(
        "STK Push failed:",
        err
      );

      stopPolling();

      setIsProcessing(false);

      setStatusMessage(
        "❌ Failed to initiate M-Pesa payment."
      );

      alert(
        "Failed to initiate M-Pesa payment."
      );
    }
  };

  /*
   * ------------------------------------------------------------
   * UI
   * ------------------------------------------------------------
   */
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">
            ✨ Ready to Generate
          </h3>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close payment modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PRICE */}
        <p className="mt-3 text-sm text-slate-300">
          Create your image for{" "}
          <strong>{price}</strong>
        </p>

        {/* PAYMENT METHODS */}
        <h4 className="mt-5 text-sm font-extrabold">
          Choose Payment Method
        </h4>

        <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
          {paymentMethods.map((method) => (
            <button
              key={method}
              onClick={() =>
                setSelectedMethod(method)
              }
              disabled={isProcessing}
              className={`w-full rounded-2xl border px-4 py-3 text-left font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                selectedMethod === method
                  ? "border-cyan-400 bg-cyan-900/30"
                  : "border-white/10 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {method}
            </button>
          ))}

          {/* M-PESA FORM */}
          {selectedMethod === "M-Pesa Kenya" && (
            <div className="mt-5 space-y-4">
              <input
                type="tel"
                placeholder="2547XXXXXXXX"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value
                  )
                }
                disabled={isProcessing}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                disabled={isProcessing}
                onClick={handleMpesaPayment}
                className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing
                  ? "Waiting for Payment..."
                  : "Send STK Push"}
              </button>
            </div>
          )}
        </div>

        {/* STATUS */}
        {statusMessage && (
          <div className="mt-5 rounded-xl bg-slate-800 p-3 text-sm text-cyan-300">
            {statusMessage}
          </div>
        )}

        {/* CANCEL */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="mt-5 w-full rounded-2xl bg-slate-700 py-3 font-bold hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
