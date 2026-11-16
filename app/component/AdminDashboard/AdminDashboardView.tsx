"use client"

import * as React from "react"
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Download,
  User,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type AdminStats = {
  totalUsers: number
  totalRecruiters: number
  totalCompanies: number
  totalJobs: number
  /** Cents. 0 when no stored amounts exist yet. */
  totalRevenue: number
}

export type AdminTransaction = {
  sessionId: string
  customer_email: string | null
  userName: string | null
  plan: string | null
  /** Cents, or null for payments recorded before amount was stored. */
  amount: number | null
  payment_date: string
  payment_status: string | null
}

type AdminDashboardViewProps = {
  stats: AdminStats
  transactions: AdminTransaction[]
}

export function AdminDashboardView({
  stats,
  transactions,
}: AdminDashboardViewProps) {
  const statCards = [
    { icon: User, label: "Total Users", value: stats.totalUsers },
    {
      icon: Users,
      label: "Total Recruiters",
      value: stats.totalRecruiters,
    },
    {
      icon: Building2,
      label: "Total Companies",
      value: stats.totalCompanies,
    },
    { icon: BriefcaseBusiness, label: "Jobs Posted", value: stats.totalJobs },
    {
      icon: CalendarDays,
      label: "Platform Revenue",
      value: formatRevenue(stats.totalRevenue),
    },
  ]

  // Builds a small CSV from the loaded transactions and downloads it.
  function handleExport() {
    const header = ["Email", "Name", "Plan", "Transaction", "Amount", "Date", "Status"]
    const rows = transactions.map((txn) => [
      txn.customer_email ?? "",
      txn.userName ?? "",
      txn.plan ?? "",
      txnRef(txn.sessionId),
      txn.amount === null ? "" : formatAmount(txn.amount),
      formatDate(txn.payment_date),
      formatStatus(txn.payment_status),
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "hireloop-transactions.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time platform performance and growth metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70"
            title="Date-range filtering is not stored in the backend yet"
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            <Download className="size-4" aria-hidden="true" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <card.icon className="size-4 text-indigo-400" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {card.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <h2 className="text-base font-semibold">
            Recent Subscription Transactions
          </h2>
          <span className="text-xs text-muted-foreground">
            Last 10 payments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-muted/40">
              <tr>
                <TableHead>User / Recruiter</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.sessionId} className="border-t border-white/5">
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-400">
                        {(txn.customer_email || "?").charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-foreground">
                          {txn.customer_email || "—"}
                        </span>
                        {txn.userName && (
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {txn.userName}
                          </span>
                        )}
                      </span>
                    </span>
                  </TableCell>

                  <TableCell>
                    {txn.plan ? (
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
                        {txn.plan}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>{txnRef(txn.sessionId)}</TableCell>

                  <TableCell>
                    {txn.amount === null ? "—" : formatAmount(txn.amount)}
                  </TableCell>

                  <TableCell>{formatDate(txn.payment_date)}</TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[12px] font-medium",
                        txn.payment_status === "paid"
                          ? "text-emerald-400"
                          : txn.payment_status === "unpaid"
                            ? "text-amber-400"
                            : "text-white/50"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {formatStatus(txn.payment_status)}
                    </span>
                  </TableCell>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <TableCell colSpan={6} className="py-10 text-center">
                    No payments yet — transactions appear here after the first
                    checkout completes.
                  </TableCell>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Small local helpers to keep the JSX above readable.

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="h-11 px-4 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </th>
  )
}

function TableCell({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td colSpan={colSpan} className={cn("px-4 py-3 text-[13px]", className)}>
      {children}
    </td>
  )
}

/** Short transaction reference derived from the Stripe session id. */
function txnRef(sessionId: string) {
  return `#${sessionId.slice(-8).toUpperCase()}`
}

/** Stripe stores cents — display dollars. */
function formatAmount(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function formatRevenue(cents: number) {
  return cents > 0 ? formatAmount(cents) : "$0.00"
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatStatus(status: string | null) {
  if (status === "paid") return "Success"
  if (status === "unpaid") return "Pending"
  return status || "—"
}
