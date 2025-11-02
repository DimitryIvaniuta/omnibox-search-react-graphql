import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "@/components/shell/Header";
import Sidebar from "@/components/shell/Sidebar";

/**
 * App — application layout shell:
 * - Sticky Header (omnibox search lives inside, with its own Apollo client)
 * - Left Sidebar (section navigation)
 * - Main content area rendering route children via <Outlet/>
 * - Accessibility: "Skip to content" link + focus management on route change
 * - Scroll restoration handled by React Router
 */
export default function App() {
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);

    // Focus main region on route change for keyboard/screen-reader users
    useEffect(() => {
        // Allow DOM paint; then move focus
        const id = window.setTimeout(() => {
            mainRef.current?.focus();
        }, 0);
        return () => window.clearTimeout(id);
    }, [pathname]);

    // Optional: update document title by section
    useEffect(() => {
        const section =
            pathname.startsWith("/listings") ? "Listings" :
                pathname.startsWith("/transactions") ? "Transactions" :
                    pathname.startsWith("/contacts") ? "Contacts" :
                        "Dashboard";
        document.title = `Omnibox • ${section}`;
    }, [pathname]);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Skip link for a11y */}
            <a
                href="#main-content"
                className="visually-hidden-focusable position-absolute top-0 start-0 m-2 btn btn-sm btn-light"
            >
                Skip to content
            </a>

            {/* Sticky Header (contains its own ApolloProvider for omnibox) */}
            <Header />

            {/* Body: sidebar + main content */}
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main
                    id="main-content"
                    ref={mainRef}
                    className="flex-grow-1 p-3"
                    tabIndex={-1}                    // focus target for skip link & route changes
                    aria-live="polite"               // announce content changes politely
                >
                    <Outlet />
                </main>
            </div>

            {/* React Router scroll restoration (keeps scroll per route key) */}
            <ScrollRestoration />
        </div>
    );
}
