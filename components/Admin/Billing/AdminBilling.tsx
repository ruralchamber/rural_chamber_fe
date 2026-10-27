"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BILLING_API } from "@/app/api/endpoints/rest-api/billing/billing";

type Tab = "contributions" | "outstanding" | "lifecycle" | "webhooks" | "jobs" | "notifications" | "reports";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "contributions", label: "Contributions" },
  { id: "outstanding", label: "Outstanding" },
  { id: "lifecycle", label: "Suspensions" },
  { id: "webhooks", label: "Webhooks" },
  { id: "jobs", label: "Jobs" },
  { id: "notifications", label: "Notifications" },
  { id: "reports", label: "Reports" },
];

export default function AdminBilling() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("contributions");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from: "", to: "", plan: "", status: "", member: "" });

  const load = async (next = tab, query = filters) => {
    setLoading(true);
    try {
      const response = await loadTab(next, query);
      setRows(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Billing data could not be loaded");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(tab, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onFilter = (event: FormEvent) => {
    event.preventDefault();
    void load("contributions", filters);
  };

  const act = async (work: () => Promise<unknown>, success: string) => {
    try {
      await work();
      toast.success(success);
      await load();
    } catch (error) {
      console.error(error);
      toast.error("The billing action could not be completed");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f1] px-4 py-6 text-[#24352b] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#01311B]">Rural Chamber</p>
            <h1 className="text-2xl font-bold text-[#01311B]">Membership billing</h1>
          </div>
          <button className="rounded-md border border-[#01311B] px-4 py-2 text-sm" onClick={() => router.push("/admin/dashboard")} type="button">
            Back to dashboard
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full px-4 py-2 text-sm ${tab === item.id ? "bg-[#01311B] text-white" : "bg-white text-[#01311B]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "contributions" && (
          <form className="mb-4 grid gap-2 rounded-xl bg-white p-4 md:grid-cols-6" onSubmit={onFilter}>
            <input className="rounded border px-3 py-2" type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} />
            <input className="rounded border px-3 py-2" type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} />
            <input className="rounded border px-3 py-2" placeholder="Plan" value={filters.plan} onChange={(event) => setFilters({ ...filters, plan: event.target.value })} />
            <input className="rounded border px-3 py-2" placeholder="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} />
            <input className="rounded border px-3 py-2" placeholder="Member" value={filters.member} onChange={(event) => setFilters({ ...filters, member: event.target.value })} />
            <button className="rounded bg-[#9FC93B] px-3 py-2 font-semibold text-[#01311B]" type="submit">Filter</button>
          </form>
        )}

        {tab === "reports" && (
          <div className="mb-4">
            <button
              className="rounded bg-[#01311B] px-4 py-2 text-sm text-white"
              type="button"
              onClick={() => act(() => BILLING_API.GENERATE_REPORT(), "Report generated")}
            >
              Generate previous month report
            </button>
          </div>
        )}

        <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
          {loading ? <p className="p-6 text-sm">Loading billing records...</p> : rows.length === 0 ? <p className="p-6 text-sm">No records for this view.</p> : (
            <table className="min-w-full text-left text-sm">
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.source || tab}-${row.id ?? row.idempotencyKey ?? index}`} className="border-t border-[#e1e7db]">
                    <td className="p-4 align-top">
                      <p className="font-semibold">{row.member || row.memberName || row.jobName || row.eventType || row.periodLabel || row.kind || row.action}</p>
                      <p className="text-[#465449]">{row.email || row.recipient || row.reference || row.idempotencyKey || row.reason || ""}</p>
                    </td>
                    <td className="p-4 align-top">{row.status || row.deliveryStatus || ""}</td>
                    <td className="p-4 align-top">{row.amount != null ? `R ${Number(row.amount).toFixed(2)}` : row.plan || ""}</td>
                    <td className="p-4 align-top">
                      {tab === "outstanding" && (
                        <button className="text-[#01311B] underline" type="button" onClick={() => act(() => BILLING_API.PAYMENT_LINK(row.id), "Payment link ready")}>Paystack link</button>
                      )}
                      {tab === "webhooks" && row.status === "failed" && (
                        <button className="text-[#01311B] underline" type="button" onClick={() => act(() => BILLING_API.RETRY_WEBHOOK(row.id), "Webhook retried")}>Retry</button>
                      )}
                      {tab === "jobs" && row.status === "failed" && (
                        <button className="text-[#01311B] underline" type="button" onClick={() => act(() => BILLING_API.RETRY_JOB(row.jobName), "Job retried")}>Retry</button>
                      )}
                      {tab === "notifications" && row.status === "failed" && (
                        <button className="text-[#01311B] underline" type="button" onClick={() => act(() => BILLING_API.RETRY_NOTIFICATION(row.id), "Notification retried")}>Retry</button>
                      )}
                      {tab === "reports" && <span>{row.periodLabel}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

async function loadTab(tab: Tab, filters: { from: string; to: string; plan: string; status: string; member: string }) {
  if (tab === "contributions") {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    return BILLING_API.CONTRIBUTIONS(query ? `?${query}` : "");
  }
  if (tab === "outstanding") return BILLING_API.OUTSTANDING();
  if (tab === "lifecycle") return BILLING_API.LIFECYCLE();
  if (tab === "webhooks") return BILLING_API.WEBHOOKS();
  if (tab === "jobs") return BILLING_API.JOBS();
  if (tab === "notifications") return BILLING_API.NOTIFICATIONS();
  return BILLING_API.REPORTS();
}
