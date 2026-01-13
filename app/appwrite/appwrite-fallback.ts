export async function ensureFallbackCookie() {
    // only run in browser
    if (typeof window === "undefined") return null;

    const API = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    if (!API || !PROJECT) {
        console.warn("Appwrite endpoint or project id missing - fallback cookie cannot be ensured.");
        return null;
    }

    try {
        // Use fetch to /v1/account with credentials included so Appwrite may return
        // the Set-Cookie or X-Fallback-Cookies header in the response.
        const res = await fetch(`${API}/v1/account`, {
            method: "GET",
            credentials: "include",
            headers: {
                "X-Appwrite-Project": PROJECT,
                "Accept": "application/json",
            },
        });

        // Appwrite will return X-Fallback-Cookies header in cross-site cases.
        const fallback = res.headers.get("x-fallback-cookies");
        if (fallback) {
            // SDK reads localStorage.cookieFallback (some SDK versions expect this key)
            // store it so subsequent SDK calls use it.
            localStorage.setItem("cookieFallback", fallback);
            // also store timestamp to help debugging/stale-checks if desired
            localStorage.setItem("cookieFallback_ts", String(Date.now()));
            return fallback;
        }

        // If Set-Cookie was present and cookie accepted, no fallback is necessary.
        return null;
    } catch (err) {
        console.warn("ensureFallbackCookie() failed", err);
        return null;
    }
}
