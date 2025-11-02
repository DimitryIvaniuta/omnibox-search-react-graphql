import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import omniboxIntrospection from "@/generated/omnibox/possibleTypes.json";

// --- ENV (Vite) ---
const OMNIBOX_URL = import.meta.env.VITE_OMNIBOX_URL as string;
const TENANT = (import.meta.env.VITE_TENANT as string) || "demo-tenant";

// ---- Links ----

// Add X-Tenant per request (keeps future room for dynamic headers)
const tenantLink = setContext((_req, prev) => ({
    headers: {
        ...(prev.headers ?? {}),
        "X-Tenant": TENANT,
    },
}));

// HTTP link (AbortController respected via context.fetchOptions.signal)
const httpLink = createHttpLink({
    uri: OMNIBOX_URL,
    fetchOptions: { method: "POST" },
});

// Retry transient issues
const retryLink = new RetryLink({
    attempts: (_count, _op, error) => {
        // For v3 we don’t rely on deprecated networkError; retry a couple times on any link error
        return !!error && _count <= 2;
    },
    delay: (count) => Math.min(250 * count, 1000),
});

// Modern error logging (no deprecated graphQLErrors/networkError)
const errorLink = onError(({ response, operation }) => {
    const errs = response?.errors ?? [];
    if (errs.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(
            `[GQL:${operation.operationName}]`,
            errs.map((e) => e.message).join(" | ")
        );
    }
});

// ---- Cache ----
// Your generated JSON has shape: { possibleTypes: { Interface: ["Impl1","Impl2"] } }
const cache = new InMemoryCache({
    possibleTypes:
    (omniboxIntrospection as unknown as { possibleTypes: Record<string, string[]> })
        .possibleTypes,
});

// ---- Client ----
export const omniboxClient = new ApolloClient({
    link: from([errorLink, retryLink, tenantLink, httpLink]),
    cache,
    ssrMode: false,
});
