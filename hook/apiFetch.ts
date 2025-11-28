import { AlertNotification } from "@/lib/alert";
import { getToken } from "@/lib/cookie";

export async function apiFetch<T>(
    url: RequestInfo,
    init: RequestInit = {}
): Promise<T> {
    const token =
        typeof window !== "undefined" ?
            getToken()
            :
            null

    const headers = new Headers(init.headers || {})

    // hanya set Content-Type kalau body JSON
    // penting, jika tidak mau cors
    if (
        init.body &&
        typeof init.body === "object" &&
        !(init.body instanceof FormData)
    ) {
        headers.set("Content-Type", "application/json")
        if (typeof init.body !== "string") {
            init.body = JSON.stringify(init.body)
        }
    }

    if (token) {
        headers.set("Authorization", token)
    }

    const res = await fetch(url, { ...init, headers })

    if (!res.ok) {
        // coba parse pesan error dari server
        let errorMessage = `API error: ${res.status}`
        try {
            const errData = await res.json()
            if (errData?.message) {
                errorMessage = errData.message
            }
        } catch {
            // fallback ke default errorMessage
        }

        if (res.status === 401 || res.status === 403) {
            if (typeof window !== "undefined") {
                AlertNotification("Login Ulang", "Session telah habis, silakan login ulang", "info", 2000, true);
                localStorage.removeItem("token")
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
                window.location.href = "/login"
            }
        }

        throw new Error(errorMessage)
    }

    return res.json()
}
