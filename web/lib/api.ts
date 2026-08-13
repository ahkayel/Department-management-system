const API_URL =
    process.env.API_URL ?? "http://127.0.0.1:8000";

export async function apiFetch(
    endpoint: string,
    options?: RequestInit
) {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        options
    );

    if (!response.ok) {
        let message = "API request failed.";

        try {
            const error = await response.json();

            if (typeof error.detail === "string") {
                message = error.detail;
            }
        } catch {
            // Ignore JSON parsing errors
        }

        throw new Error(message);
    }

    return response.json();
}