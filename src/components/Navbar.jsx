import {
  Search,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">

      {/* Logo */}
      <div className="logo-section">

        <div className="logo-box">
          ◇
        </div>

        <div className="logo">
          UML<span>forge</span>
        </div>

      </div>

      {/* Navigation */}
      <nav className="navigation">

        <a>Home</a>

        <a className="active">
          Diagram
        </a>

        <a>My Projects</a>

        <a>Templates</a>

        <a>Help</a>

      </nav>

      {/* Search */}
      <div className="search-box">

        <Search size={17} />

        <input
          type="text"
          placeholder="Search classes, diagrams..."
        />

      </div>

      {/* Theme */}
      <button className="icon-button">
        <Sun size={18} />
      </button>

      <button className="icon-button">
        <Moon size={18} />
      </button>

      {/* Profile */}
      <div className="profile">

        <div className="profile-circle">
          S
        </div>

        <div className="profile-info">
          <strong>Siddhi Nehe</strong>
          <span>Student</span>
        </div>

        <ChevronDown size={17} />

      </div>

    </header>
  );
}

export default Navbar;