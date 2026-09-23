"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"
import { BottomSheet } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/seed"
import { dailyLimitStatus } from "@/lib/compute"
import { inr } from "@/lib/format"
import type { Category } from "@/lib/types"

export type PayMode = "send" | "scan" | "recharge" | null

const MODE_LABELS: Record<Exclude<PayMode, null>, { title: string; merchant: string; category: Category }> = {
  send: { title: "Send Money", merchant: "", category: "Others" },
  scan: { title: "Scan & Pay", merchant: "Merchant QR", category: "Shopping" },
  recharge: { title: "Mobile Recharge", merchant: "Prepaid Recharge", category: "Bills" },
}

export function PaySheet({ mode, onClose, payment }: { mode: PayMode; onClose: () => void; payment?: { merchant: string; vpa: string; amount?: number } }) {
  const { state, addTransaction } = useStore()
  const preset = mode ? MODE_LABELS[mode] : null
  const [merchant, setMerchant] = useState(payment?.merchant ?? "")
  const [amount, setAmount] = useState(payment?.amount ? String(payment.amount) : "")
  const [category, setCategory] = useState<Category>(preset?.category ?? "Others")

  useEffect(() => {
    setMerchant(payment?.merchant ?? "")
    setAmount(payment?.amount ? String(payment.amount) : "")
    setCategory(preset?.category ?? "Others")
  }, [payment, preset?.category])

  const status = dailyLimitStatus(state)
  const numeric = Number(amount) || 0
  const willExceed = status.spent + numeric > status.limit
  const valid = numeric > 0 && (merchant.trim() || preset?.merchant)

  function reset() {
    setMerchant("")
    setAmount("")
    setCategory(preset?.category ?? "Others")
  }

  function submit() {
    if (!valid || !mode) return
    addTransaction({
      merchant: merchant.trim() || preset!.merchant,
      category,
      amount: numeric,
      direction: "out",
      status: "Success",
      vpa: payment?.vpa ?? (mode === "recharge" ? "recharge@zenpay" : "upi@zenpay"),
    })
    reset()
    onClose()
  }

  const fieldClass =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"

  return (
    <BottomSheet open={mode !== null} onClose={onClose} title={preset?.title}>
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            {mode === "recharge" ? "Mobile number / operator" : "Pay to"}
          </label>
          <input
            className={fieldClass}
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder={mode === "send" ? "Name or UPI ID" : preset?.merchant}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Amount (₹)
          </label>
          <input
            type="number"
            inputMode="numeric"
            className={fieldClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            className={fieldClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {numeric > 0 && willExceed && (
          <div className="flex items-start gap-2 rounded-2xl bg-warning/15 p-3 text-warning">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm font-medium">
              This pushes today&apos;s spending to {inr(status.spent + numeric)},
              over your {inr(status.limit)} daily limit.
            </p>
          </div>
        )}

        <Button
          onClick={submit}
          disabled={!valid}
          className="mt-1 h-12 w-full rounded-2xl bg-brand-gradient text-base font-semibold text-primary-foreground"
        >
          {numeric > 0 ? `Pay ${inr(numeric)}` : "Pay"}
        </Button>
      </div>
    </BottomSheet>
  )
}
