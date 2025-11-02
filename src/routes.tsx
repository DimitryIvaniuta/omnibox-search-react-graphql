import { createBrowserRouter } from "react-router-dom";
import ContactsPage from "@/pages/ContactsPage";
import ListingsPage from "@/pages/ListingsPage";
import TransactionsPage from "@/pages/TransactionsPage";
import ContactEditor from "@/pages/ContactEditor";
import ListingEditor from "@/pages/ListingEditor";
import TransactionEditor from "@/pages/TransactionEditor";
import AppShell from "@/components/shell/AppShell";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <ContactsPage /> },
            { path: "contacts", element: <ContactsPage /> },
            { path: "contacts/:id", element: <ContactEditor /> },
            { path: "listings", element: <ListingsPage /> },
            { path: "listings/:id", element: <ListingEditor /> },
            { path: "transactions", element: <TransactionsPage /> },
            { path: "transactions/:id", element: <TransactionEditor /> }
        ]
    }
]);
