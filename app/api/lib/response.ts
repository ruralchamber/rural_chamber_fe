// Backend may send `error: false`, `"false"`, null/undefined, or only `success: true`.
export function isSuccess(response: any): boolean {
  if (!response) return false;
  if (response.success === false) return false;
  if (response.error === true || response.error === "true") return false;
  if (typeof response.error === "string" && response.error !== "false") return false;
  return response.success === true || response.error === false || response.error === "false" ||
    (response.error == null && response.status >= 200 && response.status < 300);
}
