function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-mark">
            ✓
          </div>

          <span>
            Task<span>Flow</span>
          </span>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Productivity mode
        </div>
      </div>
    </header>
  );
}

export default Header;