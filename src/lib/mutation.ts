import { useState } from "react";

export function useMutation<T>(
  url: string,
  method?: string
): [
  (data?: T) => Promise<unknown>,
  { loading: boolean; response: unknown; error: string }
] {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(undefined);
  const [error, setError] = useState<string>(undefined);

  const update = (data: T): Promise<unknown> => {
    return new Promise<unknown>((r) => {
      setLoading(true);
      fetch(url, {
        method: method ? method : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then((json) => {
          setLoading(false);
          if (json.error) {
            setError(json.error);
            r(undefined);
          } else {
            setResponse(json);
            r(json);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  return [update, { loading, response, error }];
}
