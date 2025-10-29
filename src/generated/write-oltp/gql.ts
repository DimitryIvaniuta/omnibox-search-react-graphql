/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query Contact_ById($id: ID!) {\n  contact(id: $id) {\n    ...ContactDetails\n  }\n}": typeof types.Contact_ByIdDocument,
    "mutation Contact_Create($input: CreateContactInput!) {\n  createContact(input: $input) {\n    ...ContactDetails\n  }\n}": typeof types.Contact_CreateDocument,
    "mutation Contact_Delete($id: ID!, $version: Long!) {\n  deleteContact(id: $id, version: $version)\n}": typeof types.Contact_DeleteDocument,
    "fragment ContactListFields on Contact {\n  id\n  fullName\n  email\n  label\n}\n\nfragment ContactDetails on Contact {\n  id\n  fullName\n  email\n  label\n  phone\n  version\n}": typeof types.ContactListFieldsFragmentDoc,
    "query Contacts_Search($q: String!, $first: Int = 20) {\n  searchContacts(q: $q, first: $first) {\n    ...ContactListFields\n  }\n}": typeof types.Contacts_SearchDocument,
    "mutation Contact_Update($id: ID!, $input: UpdateContactInput!) {\n  updateContact(id: $id, input: $input) {\n    ...ContactDetails\n  }\n}": typeof types.Contact_UpdateDocument,
    "query Listing_ById($id: ID!) {\n  listing(id: $id) {\n    ...ListingDetails\n  }\n}": typeof types.Listing_ByIdDocument,
    "mutation Listing_Create($input: CreateListingInput!) {\n  createListing(input: $input) {\n    ...ListingDetails\n  }\n}": typeof types.Listing_CreateDocument,
    "mutation Listing_Delete($id: ID!, $version: Long!) {\n  deleteListing(id: $id, version: $version)\n}": typeof types.Listing_DeleteDocument,
    "fragment ListingListFields on Listing {\n  id\n  title\n  mlsId\n  subtitle\n}\n\nfragment ListingDetails on Listing {\n  id\n  title\n  subtitle\n  mlsId\n  contactId\n  version\n}": typeof types.ListingListFieldsFragmentDoc,
    "query Listings_Search($q: String!, $first: Int = 20) {\n  searchListings(q: $q, first: $first) {\n    ...ListingListFields\n  }\n}": typeof types.Listings_SearchDocument,
    "mutation Listing_Update($id: ID!, $input: UpdateListingInput!) {\n  updateListing(id: $id, input: $input) {\n    ...ListingDetails\n  }\n}": typeof types.Listing_UpdateDocument,
    "query Transaction_ById($id: ID!) {\n  transaction(id: $id) {\n    ...TransactionDetails\n  }\n}": typeof types.Transaction_ByIdDocument,
    "mutation Transaction_Create($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    ...TransactionDetails\n  }\n}": typeof types.Transaction_CreateDocument,
    "mutation Transaction_Delete($id: ID!, $version: Long!) {\n  deleteTransaction(id: $id, version: $version)\n}": typeof types.Transaction_DeleteDocument,
    "fragment TransactionListFields on Transaction {\n  id\n  title\n  status\n  amount\n}\n\nfragment TransactionDetails on Transaction {\n  id\n  title\n  subtitle\n  status\n  amount\n  currency\n  contactId\n  listingId\n  version\n}": typeof types.TransactionListFieldsFragmentDoc,
    "query Transactions_Search($q: String!, $first: Int = 20) {\n  searchTransactions(q: $q, first: $first) {\n    ...TransactionListFields\n  }\n}": typeof types.Transactions_SearchDocument,
    "mutation Transaction_Update($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    ...TransactionDetails\n  }\n}": typeof types.Transaction_UpdateDocument,
};
const documents: Documents = {
    "query Contact_ById($id: ID!) {\n  contact(id: $id) {\n    ...ContactDetails\n  }\n}": types.Contact_ByIdDocument,
    "mutation Contact_Create($input: CreateContactInput!) {\n  createContact(input: $input) {\n    ...ContactDetails\n  }\n}": types.Contact_CreateDocument,
    "mutation Contact_Delete($id: ID!, $version: Long!) {\n  deleteContact(id: $id, version: $version)\n}": types.Contact_DeleteDocument,
    "fragment ContactListFields on Contact {\n  id\n  fullName\n  email\n  label\n}\n\nfragment ContactDetails on Contact {\n  id\n  fullName\n  email\n  label\n  phone\n  version\n}": types.ContactListFieldsFragmentDoc,
    "query Contacts_Search($q: String!, $first: Int = 20) {\n  searchContacts(q: $q, first: $first) {\n    ...ContactListFields\n  }\n}": types.Contacts_SearchDocument,
    "mutation Contact_Update($id: ID!, $input: UpdateContactInput!) {\n  updateContact(id: $id, input: $input) {\n    ...ContactDetails\n  }\n}": types.Contact_UpdateDocument,
    "query Listing_ById($id: ID!) {\n  listing(id: $id) {\n    ...ListingDetails\n  }\n}": types.Listing_ByIdDocument,
    "mutation Listing_Create($input: CreateListingInput!) {\n  createListing(input: $input) {\n    ...ListingDetails\n  }\n}": types.Listing_CreateDocument,
    "mutation Listing_Delete($id: ID!, $version: Long!) {\n  deleteListing(id: $id, version: $version)\n}": types.Listing_DeleteDocument,
    "fragment ListingListFields on Listing {\n  id\n  title\n  mlsId\n  subtitle\n}\n\nfragment ListingDetails on Listing {\n  id\n  title\n  subtitle\n  mlsId\n  contactId\n  version\n}": types.ListingListFieldsFragmentDoc,
    "query Listings_Search($q: String!, $first: Int = 20) {\n  searchListings(q: $q, first: $first) {\n    ...ListingListFields\n  }\n}": types.Listings_SearchDocument,
    "mutation Listing_Update($id: ID!, $input: UpdateListingInput!) {\n  updateListing(id: $id, input: $input) {\n    ...ListingDetails\n  }\n}": types.Listing_UpdateDocument,
    "query Transaction_ById($id: ID!) {\n  transaction(id: $id) {\n    ...TransactionDetails\n  }\n}": types.Transaction_ByIdDocument,
    "mutation Transaction_Create($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    ...TransactionDetails\n  }\n}": types.Transaction_CreateDocument,
    "mutation Transaction_Delete($id: ID!, $version: Long!) {\n  deleteTransaction(id: $id, version: $version)\n}": types.Transaction_DeleteDocument,
    "fragment TransactionListFields on Transaction {\n  id\n  title\n  status\n  amount\n}\n\nfragment TransactionDetails on Transaction {\n  id\n  title\n  subtitle\n  status\n  amount\n  currency\n  contactId\n  listingId\n  version\n}": types.TransactionListFieldsFragmentDoc,
    "query Transactions_Search($q: String!, $first: Int = 20) {\n  searchTransactions(q: $q, first: $first) {\n    ...TransactionListFields\n  }\n}": types.Transactions_SearchDocument,
    "mutation Transaction_Update($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    ...TransactionDetails\n  }\n}": types.Transaction_UpdateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Contact_ById($id: ID!) {\n  contact(id: $id) {\n    ...ContactDetails\n  }\n}"): (typeof documents)["query Contact_ById($id: ID!) {\n  contact(id: $id) {\n    ...ContactDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Contact_Create($input: CreateContactInput!) {\n  createContact(input: $input) {\n    ...ContactDetails\n  }\n}"): (typeof documents)["mutation Contact_Create($input: CreateContactInput!) {\n  createContact(input: $input) {\n    ...ContactDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Contact_Delete($id: ID!, $version: Long!) {\n  deleteContact(id: $id, version: $version)\n}"): (typeof documents)["mutation Contact_Delete($id: ID!, $version: Long!) {\n  deleteContact(id: $id, version: $version)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ContactListFields on Contact {\n  id\n  fullName\n  email\n  label\n}\n\nfragment ContactDetails on Contact {\n  id\n  fullName\n  email\n  label\n  phone\n  version\n}"): (typeof documents)["fragment ContactListFields on Contact {\n  id\n  fullName\n  email\n  label\n}\n\nfragment ContactDetails on Contact {\n  id\n  fullName\n  email\n  label\n  phone\n  version\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Contacts_Search($q: String!, $first: Int = 20) {\n  searchContacts(q: $q, first: $first) {\n    ...ContactListFields\n  }\n}"): (typeof documents)["query Contacts_Search($q: String!, $first: Int = 20) {\n  searchContacts(q: $q, first: $first) {\n    ...ContactListFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Contact_Update($id: ID!, $input: UpdateContactInput!) {\n  updateContact(id: $id, input: $input) {\n    ...ContactDetails\n  }\n}"): (typeof documents)["mutation Contact_Update($id: ID!, $input: UpdateContactInput!) {\n  updateContact(id: $id, input: $input) {\n    ...ContactDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Listing_ById($id: ID!) {\n  listing(id: $id) {\n    ...ListingDetails\n  }\n}"): (typeof documents)["query Listing_ById($id: ID!) {\n  listing(id: $id) {\n    ...ListingDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Listing_Create($input: CreateListingInput!) {\n  createListing(input: $input) {\n    ...ListingDetails\n  }\n}"): (typeof documents)["mutation Listing_Create($input: CreateListingInput!) {\n  createListing(input: $input) {\n    ...ListingDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Listing_Delete($id: ID!, $version: Long!) {\n  deleteListing(id: $id, version: $version)\n}"): (typeof documents)["mutation Listing_Delete($id: ID!, $version: Long!) {\n  deleteListing(id: $id, version: $version)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ListingListFields on Listing {\n  id\n  title\n  mlsId\n  subtitle\n}\n\nfragment ListingDetails on Listing {\n  id\n  title\n  subtitle\n  mlsId\n  contactId\n  version\n}"): (typeof documents)["fragment ListingListFields on Listing {\n  id\n  title\n  mlsId\n  subtitle\n}\n\nfragment ListingDetails on Listing {\n  id\n  title\n  subtitle\n  mlsId\n  contactId\n  version\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Listings_Search($q: String!, $first: Int = 20) {\n  searchListings(q: $q, first: $first) {\n    ...ListingListFields\n  }\n}"): (typeof documents)["query Listings_Search($q: String!, $first: Int = 20) {\n  searchListings(q: $q, first: $first) {\n    ...ListingListFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Listing_Update($id: ID!, $input: UpdateListingInput!) {\n  updateListing(id: $id, input: $input) {\n    ...ListingDetails\n  }\n}"): (typeof documents)["mutation Listing_Update($id: ID!, $input: UpdateListingInput!) {\n  updateListing(id: $id, input: $input) {\n    ...ListingDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Transaction_ById($id: ID!) {\n  transaction(id: $id) {\n    ...TransactionDetails\n  }\n}"): (typeof documents)["query Transaction_ById($id: ID!) {\n  transaction(id: $id) {\n    ...TransactionDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Transaction_Create($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    ...TransactionDetails\n  }\n}"): (typeof documents)["mutation Transaction_Create($input: CreateTransactionInput!) {\n  createTransaction(input: $input) {\n    ...TransactionDetails\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Transaction_Delete($id: ID!, $version: Long!) {\n  deleteTransaction(id: $id, version: $version)\n}"): (typeof documents)["mutation Transaction_Delete($id: ID!, $version: Long!) {\n  deleteTransaction(id: $id, version: $version)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TransactionListFields on Transaction {\n  id\n  title\n  status\n  amount\n}\n\nfragment TransactionDetails on Transaction {\n  id\n  title\n  subtitle\n  status\n  amount\n  currency\n  contactId\n  listingId\n  version\n}"): (typeof documents)["fragment TransactionListFields on Transaction {\n  id\n  title\n  status\n  amount\n}\n\nfragment TransactionDetails on Transaction {\n  id\n  title\n  subtitle\n  status\n  amount\n  currency\n  contactId\n  listingId\n  version\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Transactions_Search($q: String!, $first: Int = 20) {\n  searchTransactions(q: $q, first: $first) {\n    ...TransactionListFields\n  }\n}"): (typeof documents)["query Transactions_Search($q: String!, $first: Int = 20) {\n  searchTransactions(q: $q, first: $first) {\n    ...TransactionListFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Transaction_Update($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    ...TransactionDetails\n  }\n}"): (typeof documents)["mutation Transaction_Update($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    ...TransactionDetails\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;