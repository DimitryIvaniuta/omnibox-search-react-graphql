// src/apollo/clients.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
// If you want batching instead of one-request-per-op:
// import { BatchHttpLink } from '@apollo/client/link/batch-http';

const tenant = import.meta.env.VITE_TENANT ?? 'demo-tenant';

function makeClient(uri: string) {
    // Modern context link (replaces deprecated setContext)
    const ctxLink = new SetContextLink((prevContext) => {
        const prevHeaders = (prevContext && (prevContext as any).headers) || {};
        return { headers: { ...prevHeaders, 'X-Tenant': tenant } };
    });

    // Transport (pick one)
    const httpLink = new HttpLink({ uri });
    // const httpLink = new BatchHttpLink({ uri, batchMax: 10, batchInterval: 10 });

    // Compose links with concat (context -> http)
    const link = ctxLink.concat(httpLink);

    return new ApolloClient({
        link,
        cache: new InMemoryCache(),
    });
}

export const omniboxClient   = makeClient(import.meta.env.VITE_OMNIBOX_URL    ?? 'http://localhost:8080/graphql');
export const writeOltpClient = makeClient(import.meta.env.VITE_WRITE_OLTP_URL ?? 'http://localhost:8081/graphql');
