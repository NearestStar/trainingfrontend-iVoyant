function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <a href="#" className="footer-logo">
            NOVA<span>TECH</span>
          </a>

          <p>
            Premium technology for people who
            build, create and explore.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <a href="#products">Products</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">Contact</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NOVA TECH. All rights reserved.</p>
        <p>Built with React + TypeScript</p>
      </div>
    </footer>
  );
}

export default Footer;