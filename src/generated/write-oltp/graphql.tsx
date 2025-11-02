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
  mlsId?: InputMaybe<Scalars['String']['input']>;
  price: MoneyInput;
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

export type ContactByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ContactByIdQuery = { __typename?: 'Query', contact?: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } | null };

export type ContactCreateMutationVariables = Exact<{
  input: CreateContactInput;
}>;


export type ContactCreateMutation = { __typename?: 'Mutation', createContact: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } };

export type ContactDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type ContactDeleteMutation = { __typename?: 'Mutation', deleteContact: boolean };

export type ContactListFieldsFragment = { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null };

export type ContactDetailsFragment = { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any };

export type ContactsSearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ContactsSearchQuery = { __typename?: 'Query', searchContacts: Array<{ __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null }> };

export type ContactUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateContactInput;
}>;


export type ContactUpdateMutation = { __typename?: 'Mutation', updateContact: { __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any } };

export type DeleteContactsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteContactsMutation = { __typename?: 'Mutation', deleteContacts: boolean };

export type ContactsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ContactsQuery = { __typename?: 'Query', contacts: Array<{ __typename?: 'Contact', id: string, fullName: string, email: string, label?: string | null, phone?: string | null, version: any }> };

export type ListingByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingByIdQuery = { __typename?: 'Query', listing?: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

export type ListingCreateMutationVariables = Exact<{
  input: CreateListingInput;
}>;


export type ListingCreateMutation = { __typename?: 'Mutation', createListing: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type ListingDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type ListingDeleteMutation = { __typename?: 'Mutation', deleteListing: boolean };

export type ListingListFieldsFragment = { __typename?: 'Listing', id: string, title: string, mlsId?: string | null, subtitle?: string | null, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type ListingDetailsFragment = { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type ListingsSearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListingsSearchQuery = { __typename?: 'Query', searchListings: Array<{ __typename?: 'Listing', id: string, title: string, mlsId?: string | null, subtitle?: string | null, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type ListingUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateListingInput;
}>;


export type ListingUpdateMutation = { __typename?: 'Mutation', updateListing: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type DeleteListingsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteListingsMutation = { __typename?: 'Mutation', deleteListings: boolean };

export type ListingsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListingsQuery = { __typename?: 'Query', listings: Array<{ __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type ListingByIdOneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListingByIdOneQuery = { __typename?: 'Query', listingById?: { __typename?: 'Listing', id: string, title: string, subtitle?: string | null, mlsId?: string | null, contactId: string, version: any, price: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

export type TransactionByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TransactionByIdQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

export type TransactionCreateMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type TransactionCreateMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type TransactionDeleteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  version: Scalars['Long']['input'];
}>;


export type TransactionDeleteMutation = { __typename?: 'Mutation', deleteTransaction: boolean };

export type TransactionListFieldsFragment = { __typename?: 'Transaction', id: string, title: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type TransactionDetailsFragment = { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } };

export type TransactionsSearchQueryVariables = Exact<{
  q: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TransactionsSearchQuery = { __typename?: 'Query', searchTransactions: Array<{ __typename?: 'Transaction', id: string, title: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type TransactionUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
}>;


export type TransactionUpdateMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, status?: string | null, contactId: string, listingId: string, version: any, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } };

export type DeleteTransactionsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteTransactionsMutation = { __typename?: 'Mutation', deleteTransactions: boolean };

export type TransactionsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'Transaction', id: string, title: string, subtitle?: string | null, contactId: string, listingId: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } }> };

export type TransactionByIdOneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TransactionByIdOneQuery = { __typename?: 'Query', transactionById?: { __typename?: 'Transaction', id: string, status?: string | null, total: { __typename?: 'Money', amount: import("decimal.js").Decimal, currency: string } } | null };

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
  price {
    amount
    currency
  }
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
  price {
    amount
    currency
  }
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
export const ContactByIdDocument = gql`
    query ContactById($id: ID!) {
  contact(id: $id) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;

/**
 * __useContactByIdQuery__
 *
 * To run a query within a React component, call `useContactByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useContactByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContactByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useContactByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ContactByIdQuery, ContactByIdQueryVariables> & ({ variables: ContactByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ContactByIdQuery, ContactByIdQueryVariables>(ContactByIdDocument, options);
      }
export function useContactByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ContactByIdQuery, ContactByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ContactByIdQuery, ContactByIdQueryVariables>(ContactByIdDocument, options);
        }
export function useContactByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ContactByIdQuery, ContactByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ContactByIdQuery, ContactByIdQueryVariables>(ContactByIdDocument, options);
        }
export type ContactByIdQueryHookResult = ReturnType<typeof useContactByIdQuery>;
export type ContactByIdLazyQueryHookResult = ReturnType<typeof useContactByIdLazyQuery>;
export type ContactByIdSuspenseQueryHookResult = ReturnType<typeof useContactByIdSuspenseQuery>;
export type ContactByIdQueryResult = ApolloReactCommon.QueryResult<ContactByIdQuery, ContactByIdQueryVariables>;
export const ContactCreateDocument = gql`
    mutation ContactCreate($input: CreateContactInput!) {
  createContact(input: $input) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;
export type ContactCreateMutationFn = ApolloReactCommon.MutationFunction<ContactCreateMutation, ContactCreateMutationVariables>;

/**
 * __useContactCreateMutation__
 *
 * To run a mutation, you first call `useContactCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactCreateMutation, { data, loading, error }] = useContactCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useContactCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ContactCreateMutation, ContactCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ContactCreateMutation, ContactCreateMutationVariables>(ContactCreateDocument, options);
      }
export type ContactCreateMutationHookResult = ReturnType<typeof useContactCreateMutation>;
export type ContactCreateMutationResult = ApolloReactCommon.MutationResult<ContactCreateMutation>;
export type ContactCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<ContactCreateMutation, ContactCreateMutationVariables>;
export const ContactDeleteDocument = gql`
    mutation ContactDelete($id: ID!, $version: Long!) {
  deleteContact(id: $id, version: $version)
}
    `;
export type ContactDeleteMutationFn = ApolloReactCommon.MutationFunction<ContactDeleteMutation, ContactDeleteMutationVariables>;

/**
 * __useContactDeleteMutation__
 *
 * To run a mutation, you first call `useContactDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactDeleteMutation, { data, loading, error }] = useContactDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useContactDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ContactDeleteMutation, ContactDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ContactDeleteMutation, ContactDeleteMutationVariables>(ContactDeleteDocument, options);
      }
export type ContactDeleteMutationHookResult = ReturnType<typeof useContactDeleteMutation>;
export type ContactDeleteMutationResult = ApolloReactCommon.MutationResult<ContactDeleteMutation>;
export type ContactDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<ContactDeleteMutation, ContactDeleteMutationVariables>;
export const ContactsSearchDocument = gql`
    query ContactsSearch($q: String!, $first: Int = 20) {
  searchContacts(q: $q, first: $first) {
    ...ContactListFields
  }
}
    ${ContactListFieldsFragmentDoc}`;

/**
 * __useContactsSearchQuery__
 *
 * To run a query within a React component, call `useContactsSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useContactsSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContactsSearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useContactsSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ContactsSearchQuery, ContactsSearchQueryVariables> & ({ variables: ContactsSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ContactsSearchQuery, ContactsSearchQueryVariables>(ContactsSearchDocument, options);
      }
export function useContactsSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ContactsSearchQuery, ContactsSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ContactsSearchQuery, ContactsSearchQueryVariables>(ContactsSearchDocument, options);
        }
export function useContactsSearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ContactsSearchQuery, ContactsSearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ContactsSearchQuery, ContactsSearchQueryVariables>(ContactsSearchDocument, options);
        }
export type ContactsSearchQueryHookResult = ReturnType<typeof useContactsSearchQuery>;
export type ContactsSearchLazyQueryHookResult = ReturnType<typeof useContactsSearchLazyQuery>;
export type ContactsSearchSuspenseQueryHookResult = ReturnType<typeof useContactsSearchSuspenseQuery>;
export type ContactsSearchQueryResult = ApolloReactCommon.QueryResult<ContactsSearchQuery, ContactsSearchQueryVariables>;
export const ContactUpdateDocument = gql`
    mutation ContactUpdate($id: ID!, $input: UpdateContactInput!) {
  updateContact(id: $id, input: $input) {
    ...ContactDetails
  }
}
    ${ContactDetailsFragmentDoc}`;
export type ContactUpdateMutationFn = ApolloReactCommon.MutationFunction<ContactUpdateMutation, ContactUpdateMutationVariables>;

/**
 * __useContactUpdateMutation__
 *
 * To run a mutation, you first call `useContactUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactUpdateMutation, { data, loading, error }] = useContactUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useContactUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ContactUpdateMutation, ContactUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ContactUpdateMutation, ContactUpdateMutationVariables>(ContactUpdateDocument, options);
      }
export type ContactUpdateMutationHookResult = ReturnType<typeof useContactUpdateMutation>;
export type ContactUpdateMutationResult = ApolloReactCommon.MutationResult<ContactUpdateMutation>;
export type ContactUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<ContactUpdateMutation, ContactUpdateMutationVariables>;
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
export const ListingByIdDocument = gql`
    query ListingById($id: ID!) {
  listing(id: $id) {
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
export const ListingCreateDocument = gql`
    mutation ListingCreate($input: CreateListingInput!) {
  createListing(input: $input) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;
export type ListingCreateMutationFn = ApolloReactCommon.MutationFunction<ListingCreateMutation, ListingCreateMutationVariables>;

/**
 * __useListingCreateMutation__
 *
 * To run a mutation, you first call `useListingCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListingCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingCreateMutation, { data, loading, error }] = useListingCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListingCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ListingCreateMutation, ListingCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ListingCreateMutation, ListingCreateMutationVariables>(ListingCreateDocument, options);
      }
export type ListingCreateMutationHookResult = ReturnType<typeof useListingCreateMutation>;
export type ListingCreateMutationResult = ApolloReactCommon.MutationResult<ListingCreateMutation>;
export type ListingCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<ListingCreateMutation, ListingCreateMutationVariables>;
export const ListingDeleteDocument = gql`
    mutation ListingDelete($id: ID!, $version: Long!) {
  deleteListing(id: $id, version: $version)
}
    `;
export type ListingDeleteMutationFn = ApolloReactCommon.MutationFunction<ListingDeleteMutation, ListingDeleteMutationVariables>;

/**
 * __useListingDeleteMutation__
 *
 * To run a mutation, you first call `useListingDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListingDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingDeleteMutation, { data, loading, error }] = useListingDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useListingDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ListingDeleteMutation, ListingDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ListingDeleteMutation, ListingDeleteMutationVariables>(ListingDeleteDocument, options);
      }
export type ListingDeleteMutationHookResult = ReturnType<typeof useListingDeleteMutation>;
export type ListingDeleteMutationResult = ApolloReactCommon.MutationResult<ListingDeleteMutation>;
export type ListingDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<ListingDeleteMutation, ListingDeleteMutationVariables>;
export const ListingsSearchDocument = gql`
    query ListingsSearch($q: String!, $first: Int = 20) {
  searchListings(q: $q, first: $first) {
    ...ListingListFields
  }
}
    ${ListingListFieldsFragmentDoc}`;

/**
 * __useListingsSearchQuery__
 *
 * To run a query within a React component, call `useListingsSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useListingsSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListingsSearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useListingsSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListingsSearchQuery, ListingsSearchQueryVariables> & ({ variables: ListingsSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListingsSearchQuery, ListingsSearchQueryVariables>(ListingsSearchDocument, options);
      }
export function useListingsSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListingsSearchQuery, ListingsSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListingsSearchQuery, ListingsSearchQueryVariables>(ListingsSearchDocument, options);
        }
export function useListingsSearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListingsSearchQuery, ListingsSearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListingsSearchQuery, ListingsSearchQueryVariables>(ListingsSearchDocument, options);
        }
export type ListingsSearchQueryHookResult = ReturnType<typeof useListingsSearchQuery>;
export type ListingsSearchLazyQueryHookResult = ReturnType<typeof useListingsSearchLazyQuery>;
export type ListingsSearchSuspenseQueryHookResult = ReturnType<typeof useListingsSearchSuspenseQuery>;
export type ListingsSearchQueryResult = ApolloReactCommon.QueryResult<ListingsSearchQuery, ListingsSearchQueryVariables>;
export const ListingUpdateDocument = gql`
    mutation ListingUpdate($id: ID!, $input: UpdateListingInput!) {
  updateListing(id: $id, input: $input) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;
export type ListingUpdateMutationFn = ApolloReactCommon.MutationFunction<ListingUpdateMutation, ListingUpdateMutationVariables>;

/**
 * __useListingUpdateMutation__
 *
 * To run a mutation, you first call `useListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [listingUpdateMutation, { data, loading, error }] = useListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ListingUpdateMutation, ListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ListingUpdateMutation, ListingUpdateMutationVariables>(ListingUpdateDocument, options);
      }
export type ListingUpdateMutationHookResult = ReturnType<typeof useListingUpdateMutation>;
export type ListingUpdateMutationResult = ApolloReactCommon.MutationResult<ListingUpdateMutation>;
export type ListingUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<ListingUpdateMutation, ListingUpdateMutationVariables>;
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
export const ListingByIdOneDocument = gql`
    query ListingByIdOne($id: ID!) {
  listingById(id: $id) {
    ...ListingDetails
  }
}
    ${ListingDetailsFragmentDoc}`;

/**
 * __useListingByIdOneQuery__
 *
 * To run a query within a React component, call `useListingByIdOneQuery` and pass it any options that fit your needs.
 * When your component renders, `useListingByIdOneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListingByIdOneQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useListingByIdOneQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListingByIdOneQuery, ListingByIdOneQueryVariables> & ({ variables: ListingByIdOneQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListingByIdOneQuery, ListingByIdOneQueryVariables>(ListingByIdOneDocument, options);
      }
export function useListingByIdOneLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListingByIdOneQuery, ListingByIdOneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListingByIdOneQuery, ListingByIdOneQueryVariables>(ListingByIdOneDocument, options);
        }
export function useListingByIdOneSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListingByIdOneQuery, ListingByIdOneQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListingByIdOneQuery, ListingByIdOneQueryVariables>(ListingByIdOneDocument, options);
        }
export type ListingByIdOneQueryHookResult = ReturnType<typeof useListingByIdOneQuery>;
export type ListingByIdOneLazyQueryHookResult = ReturnType<typeof useListingByIdOneLazyQuery>;
export type ListingByIdOneSuspenseQueryHookResult = ReturnType<typeof useListingByIdOneSuspenseQuery>;
export type ListingByIdOneQueryResult = ApolloReactCommon.QueryResult<ListingByIdOneQuery, ListingByIdOneQueryVariables>;
export const TransactionByIdDocument = gql`
    query TransactionById($id: ID!) {
  transaction(id: $id) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;

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
export const TransactionCreateDocument = gql`
    mutation TransactionCreate($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;
export type TransactionCreateMutationFn = ApolloReactCommon.MutationFunction<TransactionCreateMutation, TransactionCreateMutationVariables>;

/**
 * __useTransactionCreateMutation__
 *
 * To run a mutation, you first call `useTransactionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransactionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionCreateMutation, { data, loading, error }] = useTransactionCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransactionCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TransactionCreateMutation, TransactionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TransactionCreateMutation, TransactionCreateMutationVariables>(TransactionCreateDocument, options);
      }
export type TransactionCreateMutationHookResult = ReturnType<typeof useTransactionCreateMutation>;
export type TransactionCreateMutationResult = ApolloReactCommon.MutationResult<TransactionCreateMutation>;
export type TransactionCreateMutationOptions = ApolloReactCommon.BaseMutationOptions<TransactionCreateMutation, TransactionCreateMutationVariables>;
export const TransactionDeleteDocument = gql`
    mutation TransactionDelete($id: ID!, $version: Long!) {
  deleteTransaction(id: $id, version: $version)
}
    `;
export type TransactionDeleteMutationFn = ApolloReactCommon.MutationFunction<TransactionDeleteMutation, TransactionDeleteMutationVariables>;

/**
 * __useTransactionDeleteMutation__
 *
 * To run a mutation, you first call `useTransactionDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransactionDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionDeleteMutation, { data, loading, error }] = useTransactionDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useTransactionDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TransactionDeleteMutation, TransactionDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TransactionDeleteMutation, TransactionDeleteMutationVariables>(TransactionDeleteDocument, options);
      }
export type TransactionDeleteMutationHookResult = ReturnType<typeof useTransactionDeleteMutation>;
export type TransactionDeleteMutationResult = ApolloReactCommon.MutationResult<TransactionDeleteMutation>;
export type TransactionDeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<TransactionDeleteMutation, TransactionDeleteMutationVariables>;
export const TransactionsSearchDocument = gql`
    query TransactionsSearch($q: String!, $first: Int = 20) {
  searchTransactions(q: $q, first: $first) {
    ...TransactionListFields
  }
}
    ${TransactionListFieldsFragmentDoc}`;

/**
 * __useTransactionsSearchQuery__
 *
 * To run a query within a React component, call `useTransactionsSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsSearchQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useTransactionsSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TransactionsSearchQuery, TransactionsSearchQueryVariables> & ({ variables: TransactionsSearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TransactionsSearchQuery, TransactionsSearchQueryVariables>(TransactionsSearchDocument, options);
      }
export function useTransactionsSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TransactionsSearchQuery, TransactionsSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TransactionsSearchQuery, TransactionsSearchQueryVariables>(TransactionsSearchDocument, options);
        }
export function useTransactionsSearchSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TransactionsSearchQuery, TransactionsSearchQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TransactionsSearchQuery, TransactionsSearchQueryVariables>(TransactionsSearchDocument, options);
        }
export type TransactionsSearchQueryHookResult = ReturnType<typeof useTransactionsSearchQuery>;
export type TransactionsSearchLazyQueryHookResult = ReturnType<typeof useTransactionsSearchLazyQuery>;
export type TransactionsSearchSuspenseQueryHookResult = ReturnType<typeof useTransactionsSearchSuspenseQuery>;
export type TransactionsSearchQueryResult = ApolloReactCommon.QueryResult<TransactionsSearchQuery, TransactionsSearchQueryVariables>;
export const TransactionUpdateDocument = gql`
    mutation TransactionUpdate($id: ID!, $input: UpdateTransactionInput!) {
  updateTransaction(id: $id, input: $input) {
    ...TransactionDetails
  }
}
    ${TransactionDetailsFragmentDoc}`;
export type TransactionUpdateMutationFn = ApolloReactCommon.MutationFunction<TransactionUpdateMutation, TransactionUpdateMutationVariables>;

/**
 * __useTransactionUpdateMutation__
 *
 * To run a mutation, you first call `useTransactionUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransactionUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionUpdateMutation, { data, loading, error }] = useTransactionUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransactionUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TransactionUpdateMutation, TransactionUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TransactionUpdateMutation, TransactionUpdateMutationVariables>(TransactionUpdateDocument, options);
      }
export type TransactionUpdateMutationHookResult = ReturnType<typeof useTransactionUpdateMutation>;
export type TransactionUpdateMutationResult = ApolloReactCommon.MutationResult<TransactionUpdateMutation>;
export type TransactionUpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<TransactionUpdateMutation, TransactionUpdateMutationVariables>;
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
    title
    subtitle
    contactId
    listingId
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
export const TransactionByIdOneDocument = gql`
    query TransactionByIdOne($id: ID!) {
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
 * __useTransactionByIdOneQuery__
 *
 * To run a query within a React component, call `useTransactionByIdOneQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionByIdOneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionByIdOneQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTransactionByIdOneQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TransactionByIdOneQuery, TransactionByIdOneQueryVariables> & ({ variables: TransactionByIdOneQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>(TransactionByIdOneDocument, options);
      }
export function useTransactionByIdOneLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>(TransactionByIdOneDocument, options);
        }
export function useTransactionByIdOneSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>(TransactionByIdOneDocument, options);
        }
export type TransactionByIdOneQueryHookResult = ReturnType<typeof useTransactionByIdOneQuery>;
export type TransactionByIdOneLazyQueryHookResult = ReturnType<typeof useTransactionByIdOneLazyQuery>;
export type TransactionByIdOneSuspenseQueryHookResult = ReturnType<typeof useTransactionByIdOneSuspenseQuery>;
export type TransactionByIdOneQueryResult = ApolloReactCommon.QueryResult<TransactionByIdOneQuery, TransactionByIdOneQueryVariables>;