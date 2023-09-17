import { CheckResult } from "$lib/types";

export default async function check_availability(
    type: string,
    value: string
  ): Promise<CheckResult> {
    if (!value) return CheckResult.empty

    let availability = await fetch("/api/check_availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, value }),
      // @ts-ignore
    }).then((res) => res.json());

    return availability.result as CheckResult;
}