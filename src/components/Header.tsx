import { Link } from "react-router-dom";
import { useState } from "react";
import MegaMenu from "./MegaMenu";
import "./header.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          TOOL CRAWLER
        </Link>

        <div className="nav-item">
          <span className="nav-title" onMouseEnter={() => setOpen(true)}>
            Công cụ miễn phí ▾
          </span>

          {open && (
            <MegaMenu
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            />
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        <Link to="/terms" className="nav-link">
          Điều khoản
        </Link>
      </div>
    </header>
  );
}
