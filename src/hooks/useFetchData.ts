import { useState } from "react";

type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";

export const useFetchData = <TResponse, TBody = unknown>(
    url: string,
    method: FetchMethod,
    token?: string | null
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async (body?: TBody): Promise<TResponse> => {
        setIsLoading(true);
        try {
            const headers: HeadersInit = {};

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const options: RequestInit = {
                method,
                headers
            };

            if (method !== "GET" && body !== undefined) {
                if (body instanceof FormData) {
                    options.body = body;
                } else {
                    headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(body);
                }
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get("Content-Type");

            if (contentType?.includes("application/json")) {
                return await response.json();
            }

            return (await response.blob()) as unknown as TResponse;

        } catch (err) {
            setError(err as Error);
            return null as unknown as TResponse
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, fetchData };
};
