import { baseUrl } from "../../url";
import { GET, POST } from "@/app/api/lib/client";

const root = `${baseUrl}/billing`;

export const BILLING_API = {
  CONTRIBUTIONS: (query = "") => GET(`${root}/contributions${query}`),
  OUTSTANDING: () => GET(`${root}/outstanding`),
  PAYMENT_LINK: (id: number) => POST(`${root}/outstanding/${id}/payment-link`, {}),
  LIFECYCLE: () => GET(`${root}/lifecycle`),
  WEBHOOKS: () => GET(`${root}/webhooks`),
  RETRY_WEBHOOK: (id: number) => POST(`${root}/webhooks/${id}/retry`, {}),
  JOBS: () => GET(`${root}/jobs`),
  RETRY_JOB: (job: string) => POST(`${root}/jobs/${job}/retry`, {}),
  NOTIFICATIONS: () => GET(`${root}/notifications`),
  RETRY_NOTIFICATION: (id: number) => POST(`${root}/notifications/${id}/retry`, {}),
  REPORTS: () => GET(`${root}/reports`),
  GENERATE_REPORT: (periodLabel?: string) => POST(`${root}/reports`, periodLabel ? { periodLabel } : {}),
};
