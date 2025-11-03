import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ActionNotificationsProvider } from "@/components/ActionsNotification";
import Header from "@/components/shell/Header";
import Sidebar from "@/components/shell/Sidebar";

/**
 * App — top-level shell.
 * - Mounts ActionNotificationsProvider ONCE for the whole app (top-right toasts).
 * - Sticky header w/ omnibox (has its own Apollo client internally).
 * - Left sidebar navigation.
 * - Main content via <Outlet />.
 * - Accessibility: skip-link & focus management on route change.
 */
export default function App() {
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);

    // Focus main area when route changes (keyboard/screen-reader friendliness)
    useEffect(() => {
        const id = window.setTimeout(() => mainRef.current?.focus(), 0);
        return () => window.clearTimeout(id);
    }, [pathname]);

    // Optional: update the document title by section
    useEffect(() => {
        const section =
            pathname.startsWith("/listings") ? "Listings" :
                pathname.startsWith("/transactions") ? "Transactions" :
                    pathname.startsWith("/contacts") ? "Contacts" :
                        "Dashboard";
        document.title = `Omnibox • ${section}`;
    }, [pathname]);

    return (
        <ActionNotificationsProvider>
            <div className="d-flex flex-column min-vh-100">
                {/* Skip link for a11y */}
                <a
                    href="#main-content"
                    className="visually-hidden-focusable position-absolute top-0 start-0 m-2 btn btn-sm btn-light"
                >
                    Skip to content
                </a>

                {/* Sticky header (omnibox lives inside and uses its own ApolloProvider) */}
                <Header/>

                {/* Body: sidebar + main content */}
                <div className="d-flex flex-grow-1">
                    <Sidebar/>
                    <main
                        id="main-content"
                        ref={mainRef}
                        className="flex-grow-1 p-3"
                        tabIndex={-1}                    // focus target for skip link & route changes
                        aria-live="polite"               // announce content changes politely
                    >
                        <Outlet/>
                    </main>
                </div>

                {/* React Router scroll restoration (keeps scroll per route key) */}
                <ScrollRestoration/>
            </div>
        </ActionNotificationsProvider>
    );
}
