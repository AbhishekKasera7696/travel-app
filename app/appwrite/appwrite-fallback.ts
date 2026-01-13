export async function ensureFallbackCookie() {
    if (typeof window === "undefined") return null; // run only client-side

    let API = import.meta.env.VITE_APPWRITE_API_ENDPOINT;
    const PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    if (!API || !PROJECT) {
        console.warn("⚠️ Missing Appwrite endpoint or project id - fallback cookie cannot be ensured.");
        return null;
    }

    //  Ensure we don't double up `/v1`
    API = API.replace(/\/v1\/?$/, ""); // strip any trailing /v1

    try {
        const res = await fetch(`${API}/v1/account`, {
            method: "GET",
            credentials: "include",
            headers: {
                "X-Appwrite-Project": PROJECT,
                Accept: "application/json",
            },
        });

        const fallback = res.headers.get("x-fallback-cookies");
        if (fallback) {
            localStorage.setItem("cookieFallback", fallback);
            localStorage.setItem("cookieFallback_ts", String(Date.now()));
            console.log("Stored Appwrite fallback cookie.");
            return fallback;
        }

        return null;
    } catch (err) {
        console.warn("ensureFallbackCookie() failed", err);
        return null;
    }
}
