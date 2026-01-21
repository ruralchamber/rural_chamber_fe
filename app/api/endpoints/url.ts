//src/api/endpoints/url.ts
const mylocalUrl = 'http://localhost:5000'
const envBase = process.env.NEXT_PUBLIC_URL?.trim();
export const baseUrl = `${(envBase || mylocalUrl).replace(/\/+$/, '')}/api`;
