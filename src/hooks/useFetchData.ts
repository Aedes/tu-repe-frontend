import { useState } from "react";

type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";

export const useFetchData = <TResponse, TBody = unknown>(url: string, method: FetchMethod, token?: string | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async (body?: TBody): Promise<TResponse> => {
        setIsLoading(true);
        try {
            if (method === "GET") {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            } else {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                return data;
            }
        } catch (error) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }

        return {} as TResponse;
    }

    return { isLoading, error, fetchData };
}