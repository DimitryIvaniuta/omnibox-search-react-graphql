/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A 64-bit signed integer */
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

export type SearchHitContactFieldsFragment = { __typename?: 'SearchHitContact', id: string, score: number, subtitle?: string | null, title: string, contactId: string } & { ' $fragmentName'?: 'SearchHitContactFieldsFragment' };

export type SearchHitListingFieldsFragment = { __typename?: 'SearchHitListing', id: string, score: number, subtitle?: string | null, title: string, listingId: string, mlsId?: string | null } & { ' $fragmentName'?: 'SearchHitListingFieldsFragment' };

export type SearchHitMailingFieldsFragment = { __typename?: 'SearchHitMailing', id: string, score: number, subtitle?: string | null, title: string, mailingId: string } & { ' $fragmentName'?: 'SearchHitMailingFieldsFragment' };

export type SearchHitProductFieldsFragment = { __typename?: 'SearchHitProduct', id: string, score: number, subtitle?: string | null, title: string, productId: string } & { ' $fragmentName'?: 'SearchHitProductFieldsFragment' };

export type SearchHitReferralFieldsFragment = { __typename?: 'SearchHitReferral', id: string, score: number, subtitle?: string | null, title: string, referralId: string } & { ' $fragmentName'?: 'SearchHitReferralFieldsFragment' };

export type SearchHitTransactionFieldsFragment = { __typename?: 'SearchHitTransaction', id: string, score: number, subtitle?: string | null, title: string, transactionId: string } & { ' $fragmentName'?: 'SearchHitTransactionFieldsFragment' };

export type OmniboxQueryVariables = Exact<{
  q: Scalars['String']['input'];
  limitPerGroup?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OmniboxQuery = { __typename?: 'Query', omnibox: { __typename?: 'OmniboxResult', contacts: Array<(
      { __typename?: 'SearchHitContact' }
      & { ' $fragmentRefs'?: { 'SearchHitContactFieldsFragment': SearchHitContactFieldsFragment } }
    )>, listings: Array<(
      { __typename?: 'SearchHitListing' }
      & { ' $fragmentRefs'?: { 'SearchHitListingFieldsFragment': SearchHitListingFieldsFragment } }
    )>, mailings: Array<(
      { __typename?: 'SearchHitMailing' }
      & { ' $fragmentRefs'?: { 'SearchHitMailingFieldsFragment': SearchHitMailingFieldsFragment } }
    )>, products: Array<(
      { __typename?: 'SearchHitProduct' }
      & { ' $fragmentRefs'?: { 'SearchHitProductFieldsFragment': SearchHitProductFieldsFragment } }
    )>, referrals: Array<(
      { __typename?: 'SearchHitReferral' }
      & { ' $fragmentRefs'?: { 'SearchHitReferralFieldsFragment': SearchHitReferralFieldsFragment } }
    )>, transactions: Array<(
      { __typename?: 'SearchHitTransaction' }
      & { ' $fragmentRefs'?: { 'SearchHitTransactionFieldsFragment': SearchHitTransactionFieldsFragment } }
    )> } };

export const SearchHitContactFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitContactFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitContact"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}}]}}]} as unknown as DocumentNode<SearchHitContactFieldsFragment, unknown>;
export const SearchHitListingFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitListingFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"listingId"}},{"kind":"Field","name":{"kind":"Name","value":"mlsId"}}]}}]} as unknown as DocumentNode<SearchHitListingFieldsFragment, unknown>;
export const SearchHitMailingFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitMailingFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitMailing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"mailingId"}}]}}]} as unknown as DocumentNode<SearchHitMailingFieldsFragment, unknown>;
export const SearchHitProductFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}}]}}]} as unknown as DocumentNode<SearchHitProductFieldsFragment, unknown>;
export const SearchHitReferralFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitReferralFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitReferral"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"referralId"}}]}}]} as unknown as DocumentNode<SearchHitReferralFieldsFragment, unknown>;
export const SearchHitTransactionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitTransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}}]}}]} as unknown as DocumentNode<SearchHitTransactionFieldsFragment, unknown>;
export const OmniboxDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Omnibox"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limitPerGroup"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"omnibox"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}},{"kind":"Argument","name":{"kind":"Name","value":"limitPerGroup"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limitPerGroup"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitContactFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitListingFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mailings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitMailingFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitProductFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referrals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitReferralFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SearchHitTransactionFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitContactFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitContact"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"contactId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitListingFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"listingId"}},{"kind":"Field","name":{"kind":"Name","value":"mlsId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitMailingFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitMailing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"mailingId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitProductFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitProduct"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitReferralFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitReferral"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"referralId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SearchHitTransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SearchHitTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}}]}}]} as unknown as DocumentNode<OmniboxQuery, OmniboxQueryVariables>;