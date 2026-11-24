import { isLabTest } from "./lab-test";

export const statuses = [
  "Queued",
  "Ongoing",
  "Printing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
] as const;
export interface Order {
  team: string;
  member: string;
  files: string[];
  cost: number | null;
  printer: string;
  submittedDate: string;
  status: string;
  labNotes: string;
}
export interface StaffOrder extends Order {
  code: string;
  email: string;
}

export async function requestOrders<T>(
  params: Record<string, string>,
): Promise<T> {
  const endpoint = isLabTest() ? "/lab-test/orders" : process.env.NEXT_PUBLIC_ORDERS_API_URL;
  if (!endpoint)
    throw Error(
      "Tracking is awaiting activation. Contact nauidealab@gmail.com for order updates.",
    );
  let data;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) throw Error();
    data = await response.json();
  } catch {
    throw Error("Could not reach the lab queue. Please try again.");
  }
  if (data.error) throw Error(data.error);
  return data;
}
