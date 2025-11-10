import { ApolloClient, InMemoryCache, HttpLink, DefaultOptions } from "@apollo/client";

/**
 * Apollo client for the Omnibox GraphQL endpoint.
 * - Disables array merging for Query.omnibox (each (q,limitPerGroup) is unique)
 * - Uses no-cache by default to avoid stale omnibox results between keystrokes
 */
const VITE_OMNIBOX_URL = import.meta.env.VITE_OMNIBOX_URL || "http://localhost:8080/graphql";
const VITE_TENANT = import.meta.env.VITE_TENANT || "demo-tenant";

const httpLink = new HttpLink({
    uri: VITE_OMNIBOX_URL,
    headers: {
        "X-Tenant": VITE_TENANT,
    },
    // Make sure the browser/network layer doesn't cache responses either
    fetchOptions: { cache: "no-store" as RequestCache },
});

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                /**
                 * Treat each combination of (q, limitPerGroup) as a distinct cache entry
                 * and DO NOT merge arrays from previous responses.
                 */
                omnibox: {
                    keyArgs: ["q", "limitPerGroup"],
                    merge: false,
                },
            },
        },
    },
});

// For debounced keystroke searches we do not want Apollo cache interference.
const defaultOptions: DefaultOptions = {
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },
    mutate: {
        errorPolicy: "all",
    },
};

export const omniboxClient = new ApolloClient({
    link: httpLink,
    cache,
    defaultOptions,
});
