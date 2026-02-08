const API_BASE_URL = "http://10.136.226.189:8000"; 
// ^ if your AUTH backend is on a different port, change it (ex: :8001)

const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`; 
// If your docs show the route is /api/login instead, change to `${API_BASE_URL}/api/login`

export async function login(email: string, password: string) {
  const res = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const err = JSON.parse(text);
      throw new Error(err?.detail || "Login failed");
    } catch {
      throw new Error(`Login failed (${res.status}): ${text}`);
    }
  }

  return await res.json();
}

