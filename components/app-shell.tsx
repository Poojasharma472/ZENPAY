"use client"

import { useState } from "react"
import { Home, PieChart, Receipt, ShieldCheck, Target, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { dailyLimitStatus, detectRefundFraud } from "@/lib/compute"
import { HomeScreen } from "@/components/screens/home-screen"
import { BudgetScreen } from "@/components/screens/budget-screen"
import { BillsScreen } from "@/components/screens/bills-screen"
import { GoalScreen } from "@/components/screens/goal-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { ZenpayChatbot } from "@/components/zenpay-chatbot"
import { ProtectScreen } from "@/components/screens/protect-screen"

export type Tab = "home" | "budget" | "bills" | "protect" | "goal" | "profile"

const NAV: { tab: Tab; label: string; icon: typeof Home }[] = [
  { tab: "home", label: "Home", icon: Home },
  { tab: "budget", label: "Budget", icon: PieChart },
  { tab: "bills", label: "Bills", icon: Receipt },
  { tab: "protect", label: "Protect", icon: ShieldCheck },
  { tab: "goal", label: "Goal", icon: Target },
  { tab: "profile", label: "Profile", icon: User },
]

export function AppShell() {
  const { state } = useStore()
  const [tab, setTab] = useState<Tab>("home")

  const daily = dailyLimitStatus(state)
  const fraudCount = detectRefundFraud(state.transactions).filter(
    (f) => !state.reviewedRefunds.includes(f.txn.id),
  ).length
  const protectAlerts = fraudCount + (daily.over ? 1 : 0)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-24">
        {tab === "home" && <HomeScreen onNavigate={setTab} />}
        {tab === "budget" && <BudgetScreen />}
        {tab === "bills" && <BillsScreen />}
        {tab === "protect" && <ProtectScreen />}
        {tab === "goal" && <GoalScreen />}
        {tab === "profile" && <ProfileScreen />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur">
        <ul className="flex items-stretch justify-between px-1.5 py-2">
          {NAV.map(({ tab: t, label, icon: Icon }) => {
            const active = tab === t
            return (
              <li key={t} className="flex-1">
                <button
                  onClick={() => setTab(t)}
                  className={`relative flex w-full flex-col items-center gap-1 rounded-xl py-1.5 transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
                    {t === "protect" && protectAlerts > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                        {protectAlerts}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
  </nav>
  <ZenpayChatbot />
  </div>
  )
}
