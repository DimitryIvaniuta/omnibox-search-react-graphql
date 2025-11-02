import { NavLink } from "react-router-dom";

/**
 * Sidebar — vertical nav, pinned to the left.
 * Use Bootstrap list-group for compact, consistent styling.
 */
const Sidebar = ()=> {
    const link = ({ isActive }: { isActive: boolean }) =>
        "list-group-item list-group-item-action border-0 rounded-0" + (isActive ? " active" : "");

    return (
        <aside className="border-end bg-body" style={{ width: 240 }}>
            <div className="list-group list-group-flush">
                <NavLink to="/contacts" className={link} end>Contacts</NavLink>
                <NavLink to="/listings" className={link} end>Listings</NavLink>
                <NavLink to="/transactions" className={link} end>Transactions</NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;