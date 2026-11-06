export async function adminApi<T = Record<string, unknown>>(
  resource: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const form = body instanceof FormData;
  const result = await fetch(`/api/admin/${resource}`, {
    method,
    cache: "no-store",
    credentials: "same-origin",
    headers:
      body === undefined || form
        ? undefined
        : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : form ? body : JSON.stringify(body),
  });
  const data = await result
    .json()
    .catch(() => ({ error: "Le serveur n’a pas renvoyé de réponse valide." }));
  if (!result.ok) {
    if (result.status === 401 && resource !== "login")
      window.location.assign("/admin/login");
    throw new Error(data.error || "L’opération a échoué.");
  }
  return data as T;
}
