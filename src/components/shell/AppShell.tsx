import { Outlet } from "react-router-dom";
import Header from "@/components/shell/Header";
import Sidebar from "@/components/shell/Sidebar";

/**
 * AppShell — sticky header + left sidebar + main content.
 * Header is ~56px tall (Bootstrap default navbar height); we add top padding to avoid overlap.
 */
 const AppShell = ()=> {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="d-flex flex-grow-1" style={{ paddingTop: 0 }}>
                <Sidebar />
                <main className="flex-grow-1 p-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppShell;