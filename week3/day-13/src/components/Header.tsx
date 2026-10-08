type HeaderProps = {
  taskCount: number;
  remainingTasks: number;
};

function Header({
  taskCount,
  remainingTasks,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">✓</div>

        <div>
          <h1>TaskFlow</h1>
          <p>Your personal productivity space</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{taskCount}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Remaining</span>
          <strong>{remainingTasks}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;