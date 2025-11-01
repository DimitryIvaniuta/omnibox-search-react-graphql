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
  BigDecimal: { input: import("decimal.js").Decimal; output: import("decimal.js").Decimal; }
  Long: { input: any; output: any; }
};

export type Contact = {
  __typename?: 'Contact';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  version: Scalars['Long']['output'];
};

export type CreateContactInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateListingInput = {
  contactId: Scalars['ID']['input'];
  mlsId?: InputMaybe<Scalars['String']['input']>;
  price: MoneyInput;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  contactId: Scalars['ID']['input'];
  listingId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  total: MoneyInput;
};

export type Listing = {
  __typename?: 'Listing';
  contactId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  mlsId?: Maybe<Scalars['String']['output']>;
  price: Money;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  version: Scalars['Long']['output'];
};

export type Money = {
  __typename?: 'Money';
  amount: Scalars['BigDecimal']['output'];
  currency: Scalars['String']['output'];
};

export type MoneyInput = {
  amount: Scalars['BigDecimal']['input'];
  currency: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createContact: Contact;
  createListing: Listing;
  createTransaction: Transaction;
  deleteContact: Scalars['Boolean']['output'];
  deleteContacts: Scalars['Boolean']['output'];
  deleteListing: Scalars['Boolean']['output'];
  deleteListings: Scalars['Boolean']['output'];
  deleteTransaction: Scalars['Boolean']['output'];
  deleteTransactions: Scalars['Boolean']['output'];
  updateContact: Contact;
  updateListing: Listing;
  updateTransaction: Transaction;
};


export type MutationCreateContactArgs = {
  input: CreateContactInput;
};


export type MutationCreateListingArgs = {
  input: CreateListingInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteContactArgs = {
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
};


export type MutationDeleteContactsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteListingArgs = {
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
};


export type MutationDeleteListingsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
};


export type MutationDeleteTransactionsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationUpdateContactArgs = {
  id: Scalars['ID']['input'];
  input: UpdateContactInput;
};


export type MutationUpdateListingArgs = {
  id: Scalars['ID']['input'];
  input: UpdateListingInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
};

export type Query = {
  __typename?: 'Query';
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
  listing?: Maybe<Listing>;
  listingById?: Maybe<Listing>;
  listings: Array<Listing>;
  searchContacts: Array<Contact>;
  searchListings: Array<Listing>;
  searchTransactions: Array<Transaction>;
  transaction?: Maybe<Transaction>;
  transactionById?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};


export type QueryContactArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContactsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListingByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchContactsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QuerySearchListingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QuerySearchTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  q: Scalars['String']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  contactId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  listingId: Scalars['ID']['output'];
  status?: Maybe<Scalars['String']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  total: Money;
  version: Scalars['Long']['output'];
};

export type UpdateContactInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Long']['input'];
};

export type UpdateListingInput = {
  contactId?: InputMaybe<Scalars['ID']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  version: Scalars['Long']['input'];
};

export type UpdateTransactionInput = {
  contactId?: InputMaybe<Scalars['ID']['input']>;
  listingId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  total: MoneyInput;
  version: Scalars['Long']['input'];
};

export type Contact_ByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type Contact_ByIdQuery = { __typename?: 'Query', contact?: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } | null };

export type Contact_CreateMutationVariables = Exact<{
  input: CreateContactInput;
}>;


export type Contact_CreateMutation = { __typename?: 'Mutation', createContact: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } };

export type Contact_DeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type Contact_DeleteMutation = { __typename?: 'Mutation', deleteContact: boolean };

export type ContactListFieldsFragment = { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null };

export type ContactDetailsFragment = { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any };

export type Contacts_SearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type Contacts_SearchQuery = { __typename?: 'Query', searchContacts: Array<{ __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null }> };

export type Contact_UpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateContactInput;
}>;


export type Contact_UpdateMutation = { __typename?: 'Mutation', updateContact: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } };

export type DeleteContactsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteContactsMutation = { __typename?: 'Mutation', deleteContacts: boolean };

export type ContactsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ContactsQuery = { __typename?: 'Query', contacts: Array<{ __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any }> };

export type Listing_ByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type Listing_ByIdQuery = { __typename?: 'Query', listing?: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any } | null };

export type Listing_CreateMutationVariables = Exact<{
  input: CreateListingInput;
}>;


export type Listing_CreateMutation = { __typename?: 'Mutation', createListing: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any } };

export type Listing_DeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type Listing_DeleteMutation = { __typename?: 'Mutation', deleteListing: boolean };

export type ListingListFieldsFragment = { __typename?: 'Listing', id: string, title: string, mlsId?: string | null, subtitle?: string | null };

export type ListingDetailsFragment = { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any };

export type Listings_SearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type Listings_SearchQuery = { __typename?: 'Query', searchListings: Array<{ __typename?: 'Listing', id: string, title: string, mlsId?: string | null, subtitle?: string | null }> };

export type Listing_UpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateListingInput;
}>;


export type Listing_UpdateMutation = { __typename?: 'Mutation', updateListing: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any } };

export type DeleteListingsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteListingsMutation = { __typename?: 'Mutation', deleteListings: boolean };

export type ListingsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListingsQuery = { __typename?: 'Query', listings: Array<{ __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any }> };

export type ListingByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingByIdQuery = { __typename?: 'Query', listingById?: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any } | null };

export type Transaction_ByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type Transaction_ByIdQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

export type Transaction_CreateMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type Transaction_CreateMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type Transaction_DeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type Transaction_DeleteMutation = { __typename?: 'Mutation', deleteTransaction: boolean };

export type TransactionListFieldsFragment = { __typename?: 'Transaction', id: string, title: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type TransactionDetailsFragment = { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type Transactions_SearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type Transactions_SearchQuery = { __typename?: 'Query', searchTransactions: Array<{ __typename?: 'Transaction', id: string, title: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type Transaction_UpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
}>;


export type Transaction_UpdateMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type DeleteTransactionsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteTransactionsMutation = { __typename?: 'Mutation', deleteTransactions: boolean };

export type TransactionsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', id: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type TransactionByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TransactionByIdQuery = { __typename?: 'Query', transactionById?: { __typename?: 'Transaction', id: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

export const ContactListFieldsFragmentDoc = gql`
    fragment ContactListFields on Contact {
  id
  fullName
  email
  label
}
    `;
export const ContactDetailsFragmentDoc = gql`
    fragment ContactDetails on Contact {
  id
  fullName
  email
  label
  phone
  version
}
    `;
export const ListingListFieldsFragmentDoc = gql`
    fragment ListingListFields on Listing {
  id
  title
  mlsId
  subtitle
}
    `;
export const ListingDetailsFragmentDoc = gql`
    fragment ListingDetails on Listing {
  id
  title
  subtitle
  mlsId
  contactId
  version
}
    `;
export const TransactionListFieldsFragmentDoc = gql`
    fragment TransactionListFields on Transaction {
  id
  title
  status
  total {
    amount
    currency
  }
}
    `;
export const TransactionDetailsFragmentDoc = gql`
    fragment TransactionDetails on Transaction {
  id
  title
  subtitle
  status
  total {
    amount
    currency
  }
  contactId
  listingId
  version
}
    `;
export const Contact_ByIdDocument = gql`
    query Contact_ById($id: ID!) {
  contact(id: $id) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;

/**
 * __useContact_ByIdQuery__
 *
 * To run a query within a React component, call `useContact_ByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useContact_ByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContact_ByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useContact_ByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Contact_ByIdQuery, Contact_ByIdQueryVariables> & ({ variables: Contact_ByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Contact_ByIdQuery, Contact_ByIdQueryVariables>(Contact_ByIdDocument, options);
      }
export function useContact_ByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Contact_ByIdQuery, Contact_ByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Contact_ByIdQuery, Contact_ByIdQueryVariables>(Contact_ByIdDocument, options);
        }
export function useContact_ByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Contact_ByIdQuery, Contact_ByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Contact_ByIdQuery, Contact_ByIdQueryVariables>(Contact_ByIdDocument, options);
        }
export type Contact_ByIdQueryHookResult = ReturnType<typeof useContact_ByIdQuery>;
export type Contact_ByIdLazyQueryHookResult = ReturnType<typeof useContact_ByIdLazyQuery>;
export type Contact_ByIdSuspenseQueryHookResult = ReturnType<typeof useContact_ByIdSuspenseQuery>;
export type Contact_ByIdQueryResult = ApolloReactCommon.QueryResult<Contact_ByIdQuery, Contact_ByIdQueryVariables>;
export const Contact_CreateDocument = gql`
    mutation Contact_Create($input: CreateContactInput!) {
  createContact(input: $input) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;
export type Contact_CreateMutationFn = ApolloReactCommon.MutationFunction<Contact_CreateMutation, Contact_CreateMutationVariables>;

/**
 * __useContact_CreateMutation__
 *
 * To run a mutation, you first call `useContact_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContact_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactCreateMutation, { data, loading, error }] = useContact_CreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useContact_CreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Contact_CreateMutation, Contact_CreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Contact_CreateMutation, Contact_CreateMutationVariables>(Contact_CreateDocument, options);
      }
export type Contact_CreateMutationHookResult = ReturnType<typeof useContact_CreateMutation>;
export type Contact_CreateMutationResult = ApolloReactCommon.MutationResult<Contact_CreateMutation>;
export type Contact_CreateMutationOptions = ApolloReactCommon.BaseMutationOptions<Contact_CreateMutation, Contact_CreateMutationVariables>;
export const Contact_DeleteDocument = gql`
    mutation Contact_Delete($id: ID!, $version: Long!) {
  deleteContact(id: $id, version: $version)
}
    `;
export type Contact_DeleteMutationFn = ApolloReactCommon.MutationFunction<Contact_DeleteMutation, Contact_DeleteMutationVariables>;

/**
 * __useContact_DeleteMutation__
 *
 * To run a mutation, you first call `useContact_DeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContact_DeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactDeleteMutation, { data, loading, error }] = useContact_DeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useContact_DeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Contact_DeleteMutation, Contact_DeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Contact_DeleteMutation, Contact_DeleteMutationVariables>(Contact_DeleteDocument, options);
      }
export type Contact_DeleteMutationHookResult = ReturnType<typeof useContact_DeleteMutation>;
export type Contact_DeleteMutationResult = ApolloReactCommon.MutationResult<Contact_DeleteMutation>;
export type Contact_DeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<Contact_DeleteMutation, Contact_DeleteMutationVariables>;
export const Contacts_SearchDocument = gql`
    query Contacts_Search($q: String!, $first: Int = 20) {
  searchContacts(q: $q, first: $first) {
    ...ContactListFields
  }
}
    ${ContactListFieldsFragmentDoc}`;

/**
 * __useContacts_SearchQuery__
 *
 * To run a query within a React component, call `useContacts_SearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useContacts_SearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContacts_SearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useContacts_SearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Contacts_SearchQuery, Contacts_SearchQueryVariables> & ({ variables: Contacts_SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Contacts_SearchQuery, Contacts_SearchQueryVariables>(Contacts_SearchDocument, options);
      }
export function useContacts_SearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Contacts_SearchQuery, Contacts_SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Contacts_SearchQuery, Contacts_SearchQueryVariables>(Contacts_SearchDocument, options);
        }
export function useContacts_SearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Contacts_SearchQuery, Contacts_SearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Contacts_SearchQuery, Contacts_SearchQueryVariables>(Contacts_SearchDocument, options);
        }
export type Contacts_SearchQueryHookResult = ReturnType<typeof useContacts_SearchQuery>;
export type Contacts_SearchLazyQueryHookResult = ReturnType<typeof useContacts_SearchLazyQuery>;
export type Contacts_SearchSuspenseQueryHookResult = ReturnType<typeof useContacts_SearchSuspenseQuery>;
export type Contacts_SearchQueryResult = ApolloReactCommon.QueryResult<Contacts_SearchQuery, Contacts_SearchQueryVariables>;
export const Contact_UpdateDocument = gql`
    mutation Contact_Update($id: ID!, $input: UpdateContactInput!) {
  updateContact(id: $id, input: $input) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;
export type Contact_UpdateMutationFn = ApolloReactCommon.MutationFunction<Contact_UpdateMutation, Contact_UpdateMutationVariables>;

/**
 * __useContact_UpdateMutation__
 *
 * To run a mutation, you first call `useContact_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContact_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactUpdateMutation, { data, loading, error }] = useContact_UpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useContact_UpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Contact_UpdateMutation, Contact_UpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Contact_UpdateMutation, Contact_UpdateMutationVariables>(Contact_UpdateDocument, options);
      }
export type Contact_UpdateMutationHookResult = ReturnType<typeof useContact_UpdateMutation>;
export type Contact_UpdateMutationResult = ApolloReactCommon.MutationResult<Contact_UpdateMutation>;
export type Contact_UpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<Contact_UpdateMutation, Contact_UpdateMutationVariables>;
export const DeleteContactsDocument = gql`
    mutation DeleteContacts($ids: [ID!]!) {
  deleteContacts(ids: $ids)
}
    `;
export type DeleteContactsMutationFn = ApolloReactCommon.MutationFunction<DeleteContactsMutation, DeleteContactsMutationVariables>;

/**
 * __useDeleteContactsMutation__
 *
 * To run a mutation, you first call `useDeleteContactsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContactsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContactsMutation, { data, loading, error }] = useDeleteContactsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteContactsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteContactsMutation, DeleteContactsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteContactsMutation, DeleteContactsMutationVariables>(DeleteContactsDocument, options);
      }
export type DeleteContactsMutationHookResult = ReturnType<typeof useDeleteContactsMutation>;
export type DeleteContactsMutationResult = ApolloReactCommon.MutationResult<DeleteContactsMutation>;
export type DeleteContactsMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteContactsMutation, DeleteContactsMutationVariables>;
export const ContactsDocument = gql`
    query Contacts($offset: Int = 0, $limit: Int = 50) {
  contacts(offset: $offset, limit: $limit) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;

/**
 * __useContactsQuery__
 *
 * To run a query within a React component, call `useContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContactsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useContactsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ContactsQuery, ContactsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options);
      }
export function useContactsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ContactsQuery, ContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options);
        }
export function useContactsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ContactsQuery, ContactsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options);
        }
export type ContactsQueryHookResult = ReturnType<typeof useContactsQuery>;
export type ContactsLazyQueryHookResult = ReturnType<typeof useContactsLazyQuery>;
export type ContactsSuspenseQueryHookResult = ReturnType<typeof useContactsSuspenseQuery>;
export type ContactsQueryResult = ApolloReactCommon.QueryResult<ContactsQuery, ContactsQueryVariables>;
export const Listing_ByIdDocument = gql`
    query Listing_ById($id: ID!) {
  listing(id: $id) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;

/**
 * __useListing_ByIdQuery__
 *
 * To run a query within a React component, call `useListing_ByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useListing_ByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListing_ByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListing_ByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Listing_ByIdQuery, Listing_ByIdQueryVariables> & ({ variables: Listing_ByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Listing_ByIdQuery, Listing_ByIdQueryVariables>(Listing_ByIdDocument, options);
      }
export function useListing_ByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Listing_ByIdQuery, Listing_ByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Listing_ByIdQuery, Listing_ByIdQueryVariables>(Listing_ByIdDocument, options);
        }
export function useListing_ByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Listing_ByIdQuery, Listing_ByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Listing_ByIdQuery, Listing_ByIdQueryVariables>(Listing_ByIdDocument, options);
        }
export type Listing_ByIdQueryHookResult = ReturnType<typeof useListing_ByIdQuery>;
export type Listing_ByIdLazyQueryHookResult = ReturnType<typeof useListing_ByIdLazyQuery>;
export type Listing_ByIdSuspenseQueryHookResult = ReturnType<typeof useListing_ByIdSuspenseQuery>;
export type Listing_ByIdQueryResult = ApolloReactCommon.QueryResult<Listing_ByIdQuery, Listing_ByIdQueryVariables>;
export const Listing_CreateDocument = gql`
    mutation Listing_Create($input: CreateListingInput!) {
  createListing(input: $input) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;
export type Listing_CreateMutationFn = ApolloReactCommon.MutationFunction<Listing_CreateMutation, Listing_CreateMutationVariables>;

/**
 * __useListing_CreateMutation__
 *
 * To run a mutation, you first call `useListing_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListing_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingCreateMutation, { data, loading, error }] = useListing_CreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListing_CreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Listing_CreateMutation, Listing_CreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Listing_CreateMutation, Listing_CreateMutationVariables>(Listing_CreateDocument, options);
      }
export type Listing_CreateMutationHookResult = ReturnType<typeof useListing_CreateMutation>;
export type Listing_CreateMutationResult = ApolloReactCommon.MutationResult<Listing_CreateMutation>;
export type Listing_CreateMutationOptions = ApolloReactCommon.BaseMutationOptions<Listing_CreateMutation, Listing_CreateMutationVariables>;
export const Listing_DeleteDocument = gql`
    mutation Listing_Delete($id: ID!, $version: Long!) {
  deleteListing(id: $id, version: $version)
}
    `;
export type Listing_DeleteMutationFn = ApolloReactCommon.MutationFunction<Listing_DeleteMutation, Listing_DeleteMutationVariables>;

/**
 * __useListing_DeleteMutation__
 *
 * To run a mutation, you first call `useListing_DeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListing_DeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingDeleteMutation, { data, loading, error }] = useListing_DeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useListing_DeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Listing_DeleteMutation, Listing_DeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Listing_DeleteMutation, Listing_DeleteMutationVariables>(Listing_DeleteDocument, options);
      }
export type Listing_DeleteMutationHookResult = ReturnType<typeof useListing_DeleteMutation>;
export type Listing_DeleteMutationResult = ApolloReactCommon.MutationResult<Listing_DeleteMutation>;
export type Listing_DeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<Listing_DeleteMutation, Listing_DeleteMutationVariables>;
export const Listings_SearchDocument = gql`
    query Listings_Search($q: String!, $first: Int = 20) {
  searchListings(q: $q, first: $first) {
    ...ListingListFields
  }
}
    ${ListingListFieldsFragmentDoc}`;

/**
 * __useListings_SearchQuery__
 *
 * To run a query within a React component, call `useListings_SearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useListings_SearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListings_SearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useListings_SearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Listings_SearchQuery, Listings_SearchQueryVariables> & ({ variables: Listings_SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Listings_SearchQuery, Listings_SearchQueryVariables>(Listings_SearchDocument, options);
      }
export function useListings_SearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Listings_SearchQuery, Listings_SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Listings_SearchQuery, Listings_SearchQueryVariables>(Listings_SearchDocument, options);
        }
export function useListings_SearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Listings_SearchQuery, Listings_SearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Listings_SearchQuery, Listings_SearchQueryVariables>(Listings_SearchDocument, options);
        }
export type Listings_SearchQueryHookResult = ReturnType<typeof useListings_SearchQuery>;
export type Listings_SearchLazyQueryHookResult = ReturnType<typeof useListings_SearchLazyQuery>;
export type Listings_SearchSuspenseQueryHookResult = ReturnType<typeof useListings_SearchSuspenseQuery>;
export type Listings_SearchQueryResult = ApolloReactCommon.QueryResult<Listings_SearchQuery, Listings_SearchQueryVariables>;
export const Listing_UpdateDocument = gql`
    mutation Listing_Update($id: ID!, $input: UpdateListingInput!) {
  updateListing(id: $id, input: $input) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;
export type Listing_UpdateMutationFn = ApolloReactCommon.MutationFunction<Listing_UpdateMutation, Listing_UpdateMutationVariables>;

/**
 * __useListing_UpdateMutation__
 *
 * To run a mutation, you first call `useListing_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListing_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingUpdateMutation, { data, loading, error }] = useListing_UpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListing_UpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Listing_UpdateMutation, Listing_UpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Listing_UpdateMutation, Listing_UpdateMutationVariables>(Listing_UpdateDocument, options);
      }
export type Listing_UpdateMutationHookResult = ReturnType<typeof useListing_UpdateMutation>;
export type Listing_UpdateMutationResult = ApolloReactCommon.MutationResult<Listing_UpdateMutation>;
export type Listing_UpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<Listing_UpdateMutation, Listing_UpdateMutationVariables>;
export const DeleteListingsDocument = gql`
    mutation DeleteListings($ids: [ID!]!) {
  deleteListings(ids: $ids)
}
    `;
export type DeleteListingsMutationFn = ApolloReactCommon.MutationFunction<DeleteListingsMutation, DeleteListingsMutationVariables>;

/**
 * __useDeleteListingsMutation__
 *
 * To run a mutation, you first call `useDeleteListingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteListingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteListingsMutation, { data, loading, error }] = useDeleteListingsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteListingsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteListingsMutation, DeleteListingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteListingsMutation, DeleteListingsMutationVariables>(DeleteListingsDocument, options);
      }
export type DeleteListingsMutationHookResult = ReturnType<typeof useDeleteListingsMutation>;
export type DeleteListingsMutationResult = ApolloReactCommon.MutationResult<DeleteListingsMutation>;
export type DeleteListingsMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteListingsMutation, DeleteListingsMutationVariables>;
export const ListingsDocument = gql`
    query Listings($offset: Int = 0, $limit: Int = 50) {
  listings(offset: $offset, limit: $limit) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;

/**
 * __useListingsQuery__
 *
 * To run a query within a React component, call `useListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListingsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useListingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListingsQuery, ListingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListingsQuery, ListingsQueryVariables>(ListingsDocument, options);
      }
export function useListingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListingsQuery, ListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListingsQuery, ListingsQueryVariables>(ListingsDocument, options);
        }
export function useListingsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListingsQuery, ListingsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListingsQuery, ListingsQueryVariables>(ListingsDocument, options);
        }
export type ListingsQueryHookResult = ReturnType<typeof useListingsQuery>;
export type ListingsLazyQueryHookResult = ReturnType<typeof useListingsLazyQuery>;
export type ListingsSuspenseQueryHookResult = ReturnType<typeof useListingsSuspenseQuery>;
export type ListingsQueryResult = ApolloReactCommon.QueryResult<ListingsQuery, ListingsQueryVariables>;
export const ListingByIdDocument = gql`
    query ListingById($id: ID!) {
  listingById(id: $id) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;

/**
 * __useListingByIdQuery__
 *
 * To run a query within a React component, call `useListingByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useListingByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListingByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListingByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListingByIdQuery, ListingByIdQueryVariables> & ({ variables: ListingByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListingByIdQuery, ListingByIdQueryVariables>(ListingByIdDocument, options);
      }
export function useListingByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListingByIdQuery, ListingByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListingByIdQuery, ListingByIdQueryVariables>(ListingByIdDocument, options);
        }
export function useListingByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListingByIdQuery, ListingByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListingByIdQuery, ListingByIdQueryVariables>(ListingByIdDocument, options);
        }
export type ListingByIdQueryHookResult = ReturnType<typeof useListingByIdQuery>;
export type ListingByIdLazyQueryHookResult = ReturnType<typeof useListingByIdLazyQuery>;
export type ListingByIdSuspenseQueryHookResult = ReturnType<typeof useListingByIdSuspenseQuery>;
export type ListingByIdQueryResult = ApolloReactCommon.QueryResult<ListingByIdQuery, ListingByIdQueryVariables>;
export const Transaction_ByIdDocument = gql`
    query Transaction_ById($id: ID!) {
  transaction(id: $id) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;

/**
 * __useTransaction_ByIdQuery__
 *
 * To run a query within a React component, call `useTransaction_ByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransaction_ByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransaction_ByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTransaction_ByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Transaction_ByIdQuery, Transaction_ByIdQueryVariables> & ({ variables: Transaction_ByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>(Transaction_ByIdDocument, options);
      }
export function useTransaction_ByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>(Transaction_ByIdDocument, options);
        }
export function useTransaction_ByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>(Transaction_ByIdDocument, options);
        }
export type Transaction_ByIdQueryHookResult = ReturnType<typeof useTransaction_ByIdQuery>;
export type Transaction_ByIdLazyQueryHookResult = ReturnType<typeof useTransaction_ByIdLazyQuery>;
export type Transaction_ByIdSuspenseQueryHookResult = ReturnType<typeof useTransaction_ByIdSuspenseQuery>;
export type Transaction_ByIdQueryResult = ApolloReactCommon.QueryResult<Transaction_ByIdQuery, Transaction_ByIdQueryVariables>;
export const Transaction_CreateDocument = gql`
    mutation Transaction_Create($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;
export type Transaction_CreateMutationFn = ApolloReactCommon.MutationFunction<Transaction_CreateMutation, Transaction_CreateMutationVariables>;

/**
 * __useTransaction_CreateMutation__
 *
 * To run a mutation, you first call `useTransaction_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransaction_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionCreateMutation, { data, loading, error }] = useTransaction_CreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransaction_CreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Transaction_CreateMutation, Transaction_CreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Transaction_CreateMutation, Transaction_CreateMutationVariables>(Transaction_CreateDocument, options);
      }
export type Transaction_CreateMutationHookResult = ReturnType<typeof useTransaction_CreateMutation>;
export type Transaction_CreateMutationResult = ApolloReactCommon.MutationResult<Transaction_CreateMutation>;
export type Transaction_CreateMutationOptions = ApolloReactCommon.BaseMutationOptions<Transaction_CreateMutation, Transaction_CreateMutationVariables>;
export const Transaction_DeleteDocument = gql`
    mutation Transaction_Delete($id: ID!, $version: Long!) {
  deleteTransaction(id: $id, version: $version)
}
    `;
export type Transaction_DeleteMutationFn = ApolloReactCommon.MutationFunction<Transaction_DeleteMutation, Transaction_DeleteMutationVariables>;

/**
 * __useTransaction_DeleteMutation__
 *
 * To run a mutation, you first call `useTransaction_DeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransaction_DeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionDeleteMutation, { data, loading, error }] = useTransaction_DeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useTransaction_DeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Transaction_DeleteMutation, Transaction_DeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Transaction_DeleteMutation, Transaction_DeleteMutationVariables>(Transaction_DeleteDocument, options);
      }
export type Transaction_DeleteMutationHookResult = ReturnType<typeof useTransaction_DeleteMutation>;
export type Transaction_DeleteMutationResult = ApolloReactCommon.MutationResult<Transaction_DeleteMutation>;
export type Transaction_DeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<Transaction_DeleteMutation, Transaction_DeleteMutationVariables>;
export const Transactions_SearchDocument = gql`
    query Transactions_Search($q: String!, $first: Int = 20) {
  searchTransactions(q: $q, first: $first) {
    ...TransactionListFields
  }
}
    ${TransactionListFieldsFragmentDoc}`;

/**
 * __useTransactions_SearchQuery__
 *
 * To run a query within a React component, call `useTransactions_SearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactions_SearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactions_SearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useTransactions_SearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Transactions_SearchQuery, Transactions_SearchQueryVariables> & ({ variables: Transactions_SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Transactions_SearchQuery, Transactions_SearchQueryVariables>(Transactions_SearchDocument, options);
      }
export function useTransactions_SearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Transactions_SearchQuery, Transactions_SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Transactions_SearchQuery, Transactions_SearchQueryVariables>(Transactions_SearchDocument, options);
        }
export function useTransactions_SearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Transactions_SearchQuery, Transactions_SearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Transactions_SearchQuery, Transactions_SearchQueryVariables>(Transactions_SearchDocument, options);
        }
export type Transactions_SearchQueryHookResult = ReturnType<typeof useTransactions_SearchQuery>;
export type Transactions_SearchLazyQueryHookResult = ReturnType<typeof useTransactions_SearchLazyQuery>;
export type Transactions_SearchSuspenseQueryHookResult = ReturnType<typeof useTransactions_SearchSuspenseQuery>;
export type Transactions_SearchQueryResult = ApolloReactCommon.QueryResult<Transactions_SearchQuery, Transactions_SearchQueryVariables>;
export const Transaction_UpdateDocument = gql`
    mutation Transaction_Update($id: ID!, $input: UpdateTransactionInput!) {
  updateTransaction(id: $id, input: $input) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;
export type Transaction_UpdateMutationFn = ApolloReactCommon.MutationFunction<Transaction_UpdateMutation, Transaction_UpdateMutationVariables>;

/**
 * __useTransaction_UpdateMutation__
 *
 * To run a mutation, you first call `useTransaction_UpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransaction_UpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionUpdateMutation, { data, loading, error }] = useTransaction_UpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransaction_UpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Transaction_UpdateMutation, Transaction_UpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Transaction_UpdateMutation, Transaction_UpdateMutationVariables>(Transaction_UpdateDocument, options);
      }
export type Transaction_UpdateMutationHookResult = ReturnType<typeof useTransaction_UpdateMutation>;
export type Transaction_UpdateMutationResult = ApolloReactCommon.MutationResult<Transaction_UpdateMutation>;
export type Transaction_UpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<Transaction_UpdateMutation, Transaction_UpdateMutationVariables>;
export const DeleteTransactionsDocument = gql`
    mutation DeleteTransactions($ids: [ID!]!) {
  deleteTransactions(ids: $ids)
}
    `;
export type DeleteTransactionsMutationFn = ApolloReactCommon.MutationFunction<DeleteTransactionsMutation, DeleteTransactionsMutationVariables>;

/**
 * __useDeleteTransactionsMutation__
 *
 * To run a mutation, you first call `useDeleteTransactionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTransactionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTransactionsMutation, { data, loading, error }] = useDeleteTransactionsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteTransactionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTransactionsMutation, DeleteTransactionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteTransactionsMutation, DeleteTransactionsMutationVariables>(DeleteTransactionsDocument, options);
      }
export type DeleteTransactionsMutationHookResult = ReturnType<typeof useDeleteTransactionsMutation>;
export type DeleteTransactionsMutationResult = ApolloReactCommon.MutationResult<DeleteTransactionsMutation>;
export type DeleteTransactionsMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTransactionsMutation, DeleteTransactionsMutationVariables>;
export const TransactionsDocument = gql`
    query Transactions($offset: Int = 0, $limit: Int = 50) {
  transactions(offset: $offset, limit: $limit) {
    id
    status
    total {
      amount
      currency
    }
  }
}
    `;

/**
 * __useTransactionsQuery__
 *
 * To run a query within a React component, call `useTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
      }
export function useTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export function useTransactionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export type TransactionsQueryHookResult = ReturnType<typeof useTransactionsQuery>;
export type TransactionsLazyQueryHookResult = ReturnType<typeof useTransactionsLazyQuery>;
export type TransactionsSuspenseQueryHookResult = ReturnType<typeof useTransactionsSuspenseQuery>;
export type TransactionsQueryResult = ApolloReactCommon.QueryResult<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionByIdDocument = gql`
    query TransactionById($id: ID!) {
  transactionById(id: $id) {
    id
    status
    total {
      amount
      currency
    }
  }
}
    `;

/**
 * __useTransactionByIdQuery__
 *
 * To run a query within a React component, call `useTransactionByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTransactionByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TransactionByIdQuery, TransactionByIdQueryVariables> & ({ variables: TransactionByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TransactionByIdQuery, TransactionByIdQueryVariables>(TransactionByIdDocument, options);
      }
export function useTransactionByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TransactionByIdQuery, TransactionByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TransactionByIdQuery, TransactionByIdQueryVariables>(TransactionByIdDocument, options);
        }
export function useTransactionByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TransactionByIdQuery, TransactionByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TransactionByIdQuery, TransactionByIdQueryVariables>(TransactionByIdDocument, options);
        }
export type TransactionByIdQueryHookResult = ReturnType<typeof useTransactionByIdQuery>;
export type TransactionByIdLazyQueryHookResult = ReturnType<typeof useTransactionByIdLazyQuery>;
export type TransactionByIdSuspenseQueryHookResult = ReturnType<typeof useTransactionByIdSuspenseQuery>;
export type TransactionByIdQueryResult = ApolloReactCommon.QueryResult<TransactionByIdQuery, TransactionByIdQueryVariables>;