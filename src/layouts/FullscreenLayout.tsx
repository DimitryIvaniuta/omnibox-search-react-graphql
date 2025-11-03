import { Outlet } from "react-router-dom";

/**
 * FullscreenLayout
 * - No header, no sidebar.
 * - Leaves styling to the page (e.g., ContactEditor) to own the chrome.
 */
export default function FullscreenLayout() {
    return (
        <div className="min-vh-100 bg-body-tertiary">
            <Outlet />
        </div>
    );
}
