import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", to: "/home" },
  { label: "Career Paths", to: "/careers" },
  { label: "Resources", to: "/resources" },
  { label: "Counsellors", to: "/counsellors" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, student, admin } = useAuth();
  const currentProfile = isAdmin ? admin : student;
  const firstName = currentProfile?.fullName?.split(" ")[0] || "User";
  const homeLink = isAuthenticated ? (isAdmin ? "/admin" : "/home") : "/";

  function handleLogout() {
    logout();
    setMenuOpen(false);
  }

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <NavLink to={homeLink} className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">CC</span>
          <span>
            CareerCompass
            <small>Mentorship for smarter career choices</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {isAdmin ? null : (
                <NavLink to="/book-session" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Book Session
                </NavLink>
              )}

              <NavLink
                to={isAdmin ? "/admin" : "/student-dashboard"}
                className="nav-link nav-emphasis"
                onClick={() => setMenuOpen(false)}
              >
                {isAdmin ? "Admin Dashboard" : "My Space"}
              </NavLink>
              <span className="student-pill">{isAdmin ? `Admin: ${firstName}` : `Hi, ${firstName}`}</span>
              <button type="button" className="nav-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link nav-emphasis" onClick={() => setMenuOpen(false)}>
                Student Login
              </NavLink>
              <NavLink to="/signup" className="nav-secondary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </NavLink>
              <NavLink to="/admin/login" className="nav-cta" onClick={() => setMenuOpen(false)}>
                Admin Login
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
