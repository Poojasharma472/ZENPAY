# 💸 ZENPAY

> **Pay Smart. Save Smarter.**  
> A UPI-first payments app that puts a smart budget layer between you and every transaction — so spending never outruns your money.

**🔗 Explore ZenPay — https://vercel.app**

***🚩 The Problem:***
Musa Codex Hackathon — FinTech & Digital Payments

Everyday money management in India breaks down in a handful of very specific, very human ways:
* **The Interest Rate Nobody Explained (CX0501)** — borrowers agree to EMIs and credit terms without understanding the real cost of interest until it's too late.
* **Split the Bill, Save the Friendship (CX0502)** — group expenses (rent, trips, dinners) turn into awkward math and awkward conversations.
* **The EMI That Ate the Salary (CX0503)** — recurring EMIs silently eat 40–60% of take-home pay, leaving no room for savings or emergencies.
* **The Chit Fund That Vanished Overnight (CX0504)** — informal savings schemes offer zero transparency and no digital trail.
* **The Subsidy That Slipped Through (CX0505)** — eligible users miss government subsidies and benefits because they never see them surfaced at the point of payment.
* **Credit Score for the Invisible (CX0506)** — gig workers and first-time earners have no formal credit history, locking them out of loans.
* **The Fraudulent Refund Loop (CX0507)** — refund and chargeback scams exploit trust in UPI's speed and irreversibility.
* **Cash Flow Blind Spot (CX0508)** — most people can't see, in real time, how much they can safely spend today without wrecking the rest of the month.

**🚀 Our Solution: ZenPay**
ZenPay isn't just another UPI wrapper — it's a spending firewall. Every payment passes through a budget-aware layer before it's confirmed, so the app can warn, split, track, or block before money moves, not after.

**Key Features**
* **UPI Payments** — send and receive money through a simulated/integrated UPI flow.
* **Daily Spending Limits** — set a safe daily cap; the app tracks live spend against it.
* **Smart Budgeting**— categorize expenses and see where money is actually going, in real time.
***Money Protection Layer** — before any UPI transfer is confirmed, ZenPay checks it against your daily limit, your recent spending pattern, and known refund/scam signatures (new payee + urgent request, repeat refund attempts, amount far above your usual range). Risky transactions are held with a one-tap "Are you sure?" confirmation instead of going through silently.

**📸 Platform Showcase**

**1. The Heart (Smart Dashboard)**
One number, updated live — your Daily Pulse tells you exactly what's safe to spend, today.

<img width="975" height="473" alt="image" src="https://github.com/user-attachments/assets/0f269c83-983c-44df-bccd-8d4496778d35" />


**2. The Guard (Protection Layer)**
Intercepts risky payments at the point of intent — flags limit-breaking, unusual, or refund-fraud-shaped transactions with a plain-language warning before the money actually moves.

<img width="975" height="471" alt="image" src="https://github.com/user-attachments/assets/eb1e8787-7f3d-4fa7-8238-c2e592b6cbcd" />


**3. AI Architect (The Blueprint)**
A legally-grounded 50/30/20 plan tailored to the user's city, tax laws, and risk profile.

<img width="975" height="471" alt="image" src="https://github.com/user-attachments/assets/973e84c7-758b-4132-bb83-18a40b129900" />


**🤖 Key Features of Fraud Detection Systems in Digital Payments**

<img width="901" height="819" alt="image" src="https://github.com/user-attachments/assets/ffd4fb75-edcf-48bc-ae72-15107a1d41ed" />

**⚙️ How It Works (The Technical Brain)**

**1. The Spend Guard Engine**
Safe-to-Spend Today = (Remaining Budget) / (Days Left in Period)
Every transaction re-checks this figure live, so the daily limit adjusts automatically the moment you overspend or underspend.

**2. The Protection Layer**
* Risk Detection: every outgoing payment is scored against three checks before it's confirmed: (1) does it blow past today's Safe-to-Spend figure, (2) does the payee/amount pattern match a known refund-fraud or chargeback-loop signature, (3) is it a sudden spike versus the user's rolling spend average. A transaction that trips any check is paused with a clear, plain-language warning instead of a generic OTP screen.
* Adaptive Limits: the daily limit isn't static; it recalculates after every transaction based on remaining balance and days left, and tightens automatically after a flagged/overridden transaction so one risky payment doesn't cascade into a bad week.

***🛠️ Tech Stack***
* Frontend: Next.js / React
* Styling: Tailwind CSS / shadcn-ui
* Backend / Database: Supabase, Postgres, Firebase

***🛠️ Local Setup***
Prerequisites: Node.js (v18+)

Clone the Repository
```bash
git clone [your-repo-url]
cd zenpay
```

Install Dependencies
```bash
npm install
```

Configure Environment Variables
Create a .env.local file in the root and add your keys:
```env
[ENV_VAR_NAME]=your_key_here
```

Run the Development Server
```bash
npm run dev
```

***🗺️ Accessing the Platform***
* **Live App:** **zenpay-gamma.vercel.app**
* **Entry Point:** the app opens straight to the ZenPay home screen, showing today's Safe-to-Spend figure front and center along with recent transactions. From there, "Send Money" opens the UPI payment flow and "Set Daily Limit" opens the budget guard calibration — no separate landing/marketing page to click through first.

***Presentation Tip:** run a live UPI payment that deliberately exceeds the daily limit (or mimics a suspicious refund request) and let judges watch the Money Protection Layer intercept it in real time with a plain-language warning, before you confirm anyway to show the transaction still completing. That one interaction sells the "firewall, not just a tracker" pitch in under 20 seconds.

***👥 The Team : Hacksmiths***

| NAME | PROFILE |
| :--- | :--- |
| Pooja Santosh Sharma | https://linkedin.com |
| Shreya Nitin Sankpal |https://www.linkedin.com/in/shreya-s-ba8113411/ |
|
| Samarth Manish Shelar | |

***Built for the Musa Codex Hackathon ❤️ — FinTech & Digital Payments.***
