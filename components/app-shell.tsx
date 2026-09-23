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
    <div className="min-h-dvh w-full bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/80 px-4 py-6 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-gradient text-lg font-bold text-primary-foreground">Z</div>
          <div><p className="font-bold tracking-tight text-foreground">ZENPAY</p><p className="text-xs text-muted-foreground">Personal finance</p></div>
        </div>
        <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-1">
          {NAV.map(({ tab: t, label, icon: Icon }) => {
            const active = tab === t
            return <button key={t} onClick={() => setTab(t)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} aria-current={active ? "page" : undefined}><Icon className="size-5" strokeWidth={active ? 2.4 : 2} /><span>{label}</span>{t === "protect" && protectAlerts > 0 && <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">{protectAlerts}</span>}</button>
          })}
        </nav>
        <div className="rounded-2xl bg-accent p-4 text-sm"><p className="font-semibold text-foreground">Your money, your peace.</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Stay on top of every rupee with Zenpay.</p></div>
      </aside>

      <div className="min-w-0 flex-1">
      <main className="mx-auto min-h-dvh w-full max-w-[1440px] pb-24 lg:pb-10">
        {tab === "home" && <HomeScreen onNavigate={setTab} />}
        {tab === "budget" && <BudgetScreen />}
        {tab === "bills" && <BillsScreen />}
        {tab === "protect" && <ProtectScreen />}
        {tab === "goal" && <GoalScreen />}
        {tab === "profile" && <ProfileScreen />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-1.5 py-2">
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
    </div>
  )
}
