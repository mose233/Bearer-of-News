type PaymentGateProps = {
  amount: number;
  label: string;
  onPaid: () => void;
};

export default function PaymentGate({ amount, label, onPaid }: PaymentGateProps) {
  const handlePay = () => {
    alert(
      `M-Pesa payment placeholder: User will pay KSh ${amount} before ${label}.`
    );

    onPaid();
  };

  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
      <p className="text-sm font-bold text-emerald-100">
        Premium AI Action
      </p>

      <p className="mt-1 text-xs leading-5 text-emerald-200">
        Pay KSh {amount} with M-Pesa to {label}. After confirmation,
        generation starts immediately.
      </p>

      <button
        type="button"
        onClick={handlePay}
        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500"
      >
        Pay KSh {amount} & Continue
      </button>
    </div>
  );
}
