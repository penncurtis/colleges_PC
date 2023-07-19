import {NavLink} from "react-router-dom"

function NavBar(){
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/" activeClassName="active-link">Home</NavLink>
            </div>
            <div className="navbar-links">
                <NavLink to="/login" activeClassName="active-link">Login</NavLink>
                <NavLink to="/threads" activeClassName="active-link">All Threads</NavLink>
                <NavLink to="/universities" activeClassName="active-link">Universities</NavLink>
                <NavLink to="/add_university" activeClassName="active-link">Add a School</NavLink>
                <NavLink to="/community" activeClassName="active-link">Athena Community</NavLink>
            </div>
        </nav>
    )
}

export default NavBar;