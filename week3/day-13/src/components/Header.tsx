import Button from "./Button";

function Header() {
  return (
    <header className="header">
      <a href="#" className="logo">
        NOVA<span>TECH</span>
      </a>

      <nav className="nav">
        <a href="#products">Products</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </nav>

      <Button text="Shop Now" />
    </header>
  );
}

export default Header;