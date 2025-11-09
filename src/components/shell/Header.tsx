// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import OmniboxSearchBar from "@/components/OmniboxSearchBar/OmniboxSearchBar";

// If your OmniboxSearchBar exports a type, you can import it:
//   import type { OmniboxPick } from "@/components/OmniboxSearchBar";
// Otherwise just re-declare the union locally:
type OmniboxPick = {
    kind: "contact" | "listing" | "transaction" | "product" | "mailing" | "referral";
    id: string;
};

export default function Header() {
    const nav = useNavigate();

    const handlePick = (hit: OmniboxPick) => {
        // Switch keeps TS narrow; no “index by kind” errors.
        switch (hit.kind) {
            case "contact":
                nav(`/contacts/${hit.id}`);
                break;
            case "listing":
                nav(`/listings/${hit.id}`);
                break;
            case "transaction":
                nav(`/transactions/${hit.id}`);
                break;
            // Other groups route wherever you want; for now go home.
            case "product":
            case "mailing":
            case "referral":
            default:
                nav("/");
                break;
        }
    };

    return (
        <header className="position-sticky top-0 bg-light border-bottom" style={{ zIndex: 1030 }}>
            <div className="container-fluid d-flex align-items-center gap-3 py-2">
                <Link to="/" className="navbar-brand fw-semibold mb-0 text-decoration-none">Omnibox</Link>

                {/* Professional pill-styled search with outside-click close */}
                <div className="flex-grow-1" style={{ maxWidth: 720 }}>
                    <OmniboxSearchBar onPick={handlePick} />
                </div>
            </div>
        </header>
    );
}
