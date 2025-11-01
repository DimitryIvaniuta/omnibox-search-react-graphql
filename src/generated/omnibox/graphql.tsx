import { gql } from '@apollo/client';
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Long: { input: any; output: any; }
};

export type OmniboxResult = {
  __typename?: 'OmniboxResult';
  contacts: Array<SearchHitContact>;
  listings: Array<SearchHitListing>;
  mailings: Array<SearchHitMailing>;
  products: Array<SearchHitProduct>;
  referrals: Array<SearchHitReferral>;
  transactions: Array<SearchHitTransaction>;
};

/**  Root types (declared once) */
export type Query = {
  __typename?: 'Query';
  omnibox: OmniboxResult;
};


/**  Root types (declared once) */
export type QueryOmniboxArgs = {
  limitPerGroup?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};

export type SearchHit = {
  id: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitContact = SearchHit & {
  __typename?: 'SearchHitContact';
  contactId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitListing = SearchHit & {
  __typename?: 'SearchHitListing';
  id: Scalars['ID']['output'];
  listingId: Scalars['ID']['output'];
  mlsId?: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitMailing = SearchHit & {
  __typename?: 'SearchHitMailing';
  id: Scalars['ID']['output'];
  mailingId: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitProduct = SearchHit & {
  __typename?: 'SearchHitProduct';
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitReferral = SearchHit & {
  __typename?: 'SearchHitReferral';
  id: Scalars['ID']['output'];
  referralId: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SearchHitTransaction = SearchHit & {
  __typename?: 'SearchHitTransaction';
  id: Scalars['ID']['output'];
  score: Scalars['Float']['output'];
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  transactionId: Scalars['ID']['output'];
};

export type SearchHitContactFieldsFragment = { __typename?: 'SearchHitContact', id: string, score: number, subtitle?: string | null, title: string, contactId: string };

export type SearchHitListingFieldsFragment = { __typename?: 'SearchHitListing', id: string, score: number, subtitle?: string | null, title: string, listingId: string, mlsId?: string | null };

export type SearchHitMailingFieldsFragment = { __typename?: 'SearchHitMailing', id: string, score: number, subtitle?: string | null, title: string, mailingId: string };

export type SearchHitProductFieldsFragment = { __typename?: 'SearchHitProduct', id: string, score: number, subtitle?: string | null, title: string, productId: string };

export type SearchHitReferralFieldsFragment = { __typename?: 'SearchHitReferral', id: string, score: number, subtitle?: string | null, title: string, referralId: string };

export type SearchHitTransactionFieldsFragment = { __typename?: 'SearchHitTransaction', id: string, score: number, subtitle?: string | null, title: string, transactionId: string };

export type OmniboxQueryVariables = Exact<{
  q: Scalars['String']['input'];
  limitPerGroup?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OmniboxQuery = { __typename?: 'Query', omnibox: { __typename?: 'OmniboxResult', contacts: Array<{ __typename?: 'SearchHitContact', id: string, score: number, subtitle?: string | null, title: string, contactId: string }>, listings: Array<{ __typename?: 'SearchHitListing', id: string, score: number, subtitle?: string | null, title: string, listingId: string, mlsId?: string | null }>, mailings: Array<{ __typename?: 'SearchHitMailing', id: string, score: number, subtitle?: string | null, title: string, mailingId: string }>, products: Array<{ __typename?: 'SearchHitProduct', id: string, score: number, subtitle?: string | null, title: string, productId: string }>, referrals: Array<{ __typename?: 'SearchHitReferral', id: string, score: number, subtitle?: string | null, title: string, referralId: string }>, transactions: Array<{ __typename?: 'SearchHitTransaction', id: string, score: number, subtitle?: string | null, title: string, transactionId: string }> } };

export const SearchHitContactFieldsFragmentDoc = gql`
    fragment SearchHitContactFields on SearchHitContact {
  id
  score
  subtitle
  title
  contactId
}
    `;
export const SearchHitListingFieldsFragmentDoc = gql`
    fragment SearchHitListingFields on SearchHitListing {
  id
  score
  subtitle
  title
  listingId
  mlsId
}
    `;
export const SearchHitMailingFieldsFragmentDoc = gql`
    fragment SearchHitMailingFields on SearchHitMailing {
  id
  score
  subtitle
  title
  mailingId
}
    `;
export const SearchHitProductFieldsFragmentDoc = gql`
    fragment SearchHitProductFields on SearchHitProduct {
  id
  score
  subtitle
  title
  productId
}
    `;
export const SearchHitReferralFieldsFragmentDoc = gql`
    fragment SearchHitReferralFields on SearchHitReferral {
  id
  score
  subtitle
  title
  referralId
}
    `;
export const SearchHitTransactionFieldsFragmentDoc = gql`
    fragment SearchHitTransactionFields on SearchHitTransaction {
  id
  score
  subtitle
  title
  transactionId
}
    `;
export const OmniboxDocument = gql`
    query Omnibox($q: String!, $limitPerGroup: Int = 5) {
  omnibox(q: $q, limitPerGroup: $limitPerGroup) {
    contacts {
      ...SearchHitContactFields
    }
    listings {
      ...SearchHitListingFields
    }
    mailings {
      ...SearchHitMailingFields
    }
    products {
      ...SearchHitProductFields
    }
    referrals {
      ...SearchHitReferralFields
    }
    transactions {
      ...SearchHitTransactionFields
    }
  }
}
    ${SearchHitContactFieldsFragmentDoc}
${SearchHitListingFieldsFragmentDoc}
${SearchHitMailingFieldsFragmentDoc}
${SearchHitProductFieldsFragmentDoc}
${SearchHitReferralFieldsFragmentDoc}
${SearchHitTransactionFieldsFragmentDoc}`;

/**
 * __useOmniboxQuery__
 *
 * To run a query within a React component, call `useOmniboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useOmniboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOmniboxQuery({
 *   variables: {
 *      q: // value for 'q'
 *      limitPerGroup: // value for 'limitPerGroup'
 *   },
 * });
 */
export function useOmniboxQuery(baseOptions: ApolloReactHooks.QueryHookOptions<OmniboxQuery, OmniboxQueryVariables> & ({ variables: OmniboxQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<OmniboxQuery, OmniboxQueryVariables>(OmniboxDocument, options);
      }
export function useOmniboxLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<OmniboxQuery, OmniboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<OmniboxQuery, OmniboxQueryVariables>(OmniboxDocument, options);
        }
export function useOmniboxSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<OmniboxQuery, OmniboxQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<OmniboxQuery, OmniboxQueryVariables>(OmniboxDocument, options);
        }
export type OmniboxQueryHookResult = ReturnType<typeof useOmniboxQuery>;
export type OmniboxLazyQueryHookResult = ReturnType<typeof useOmniboxLazyQuery>;
export type OmniboxSuspenseQueryHookResult = ReturnType<typeof useOmniboxSuspenseQuery>;
export type OmniboxQueryResult = ApolloReactCommon.QueryResult<OmniboxQuery, OmniboxQueryVariables>;