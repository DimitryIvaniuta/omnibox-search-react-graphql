import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
    FieldPolicy,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import writeIntrospection from "@/generated/write-oltp/possibleTypes.json";

// --- ENV (Vite) ---
const WRITE_URL = import.meta.env.VITE_WRITE_OLTP_URL as string;
const TENANT = (import.meta.env.VITE_TENANT as string) || "demo-tenant";

// ---- Links ----
const tenantLink = setContext((_req, prev) => ({
    headers: {
        ...(prev.headers ?? {}),
        "X-Tenant": TENANT,
    },
}));

const httpLink = createHttpLink({
    uri: WRITE_URL,
    fetchOptions: { method: "POST" },
});

const retryLink = new RetryLink({
    attempts: (count, _op, error) => !!error && count <= 2,
    delay: (count) => Math.min(250 * count, 1000),
});

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

// ---- Cache policies ----
const replaceList: FieldPolicy<readonly unknown[]> = {
    keyArgs: ["offset", "limit"], // separate cache entries per page
    merge(_existing, incoming) {
        return incoming;
    },
};

const cache = new InMemoryCache({
    possibleTypes:
    (writeIntrospection as unknown as { possibleTypes: Record<string, string[]> })
        .possibleTypes,
    typePolicies: {
        Query: {
            fields: {
                contacts: replaceList,
                listings: replaceList,
                transactions: replaceList,
            },
        },
    },
});

// ---- Client ----
export const writeClient = new ApolloClient({
    link: from([errorLink, retryLink, tenantLink, httpLink]),
    cache,
    ssrMode: false,
});
