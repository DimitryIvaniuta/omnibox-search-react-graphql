import { createBrowserRouter } from "react-router-dom";
import App from "@/App";                         // your normal shell with Header + Sidebar
import FullscreenLayout from "@/layouts/FullscreenLayout"; // fullscreen editor layout
import ContactsPage from "@/pages/ContactsPage";
import ListingsPage from "@/pages/ListingsPage";
import TransactionsPage from "@/pages/TransactionsPage";
import ContactEditor from "@/pages/ContactEditor";
import ListingEditor from "@/pages/ListingEditor";
import TransactionEditor from "@/pages/TransactionEditor";
import SearchAnalyticsPage from "@/pages/SearchAnalyticsPage";

/**
 * Two layout trees:
 * 1) App (default pages: has Header + Sidebar)
 * 2) FullscreenLayout (editor routes only, no chrome)
 *
 * Important: We DO NOT define "contacts/:id" under <App/> to avoid rendering the sidebar there.
 * The absolute route "contacts/:id" lives under FullscreenLayout exclusively.
 */
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <ContactsPage /> },
            { path: "contacts", element: <ContactsPage /> },
            { path: "listings", element: <ListingsPage /> },
            { path: "transactions", element: <TransactionsPage /> },
            {
                path: "/ops/search-analytics",
                element: <SearchAnalyticsPage />,
            }
            // create flows are full-screen too (optional): you can move "new" below FullscreenLayout if desired
        ],
    },
    {
        // Fullscreen editor routes (no header/sidebar)
        element: <FullscreenLayout />,
        children: [
            { path: "contacts/new", element: <ContactEditor /> },
            { path: "contacts/:id", element: <ContactEditor /> },

            // You can also move these if you want full-screen for other editors:
            { path: "listings/new", element: <ListingEditor /> },
            { path: "listings/:id", element: <ListingEditor /> },
            { path: "transactions/new", element: <TransactionEditor /> },
            { path: "transactions/:id", element: <TransactionEditor /> },
        ],
    },
]);
