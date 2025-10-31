import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
    BigDecimal: 'import("decimal.js").Decimal',
};

/**
 * Generates typed documents for BOTH services:
 * - src/generated/omnibox/     (schema: VITE_OMNIBOX_URL)
 * - src/generated/write-oltp/  (schema: VITE_WRITE_OLTP_URL)
 * Uses client preset (perfect for Apollo useQuery/useMutation with typed docs).
 */
const config: CodegenConfig = {
    overwrite: true,
    generates: {
        'src/generated/omnibox/': {
            preset: 'client',
            schema: [
                {
                    [process.env.VITE_OMNIBOX_URL || 'http://localhost:8080/graphql']: {
                        headers: { 'X-Tenant': process.env.VITE_TENANT || 'demo-tenant' }
                    }
                }
            ],
            documents: ['src/ops/omnibox/**/*.graphql']
        },
        'src/generated/write-oltp/': {
            preset: 'client',
            schema: [
                {
                    [process.env.VITE_WRITE_OLTP_URL || 'http://localhost:8081/graphql']: {
                        headers: { 'X-Tenant': process.env.VITE_TENANT || 'demo-tenant' }
                    }
                }
            ],
            documents: ['src/ops/write-oltp/**/*.graphql'],
            config: { scalars }
        }
    }
};

export default config;
