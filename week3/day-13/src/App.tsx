import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";
import ProductCard from "./components/ProductCard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />

      <main>
        {/* Hero Section */}

        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              THE FUTURE OF TECH
            </span>

            <h1>
              Technology that
              <span> moves you forward.</span>
            </h1>

            <p>
              Discover thoughtfully designed devices
              built for work, creativity and everything
              in between.
            </p>

            <div className="hero-actions">
              <Button text="Explore Products" />
              <Button
                text="Our Story"
                variant="secondary"
              />
            </div>

            <div className="hero-stats">
              <div>
                <strong>25K+</strong>
                <span>Happy customers</span>
              </div>

              <div>
                <strong>4.9/5</strong>
                <span>Average rating</span>
              </div>

              <div>
                <strong>48h</strong>
                <span>Fast delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>

            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85"
              alt="Premium laptop"
            />

            <div className="floating-card">
              <span>Editor's Pick</span>
              <strong>ProBook X1</strong>
              <small>Built for creators</small>
            </div>
          </div>
        </section>

        {/* Brand strip */}

        <section className="brand-strip">
          <span>TRUSTED BY CREATORS</span>

          <div>
            <strong>ARC</strong>
            <strong>MONO</strong>
            <strong>PIXEL</strong>
            <strong>SHIFT</strong>
            <strong>FORM</strong>
          </div>
        </section>

        {/* Products */}

        <section
          className="products-section"
          id="products"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                CURATED COLLECTION
              </span>

              <h2>
                Designed for
                <span> better work.</span>
              </h2>
            </div>

            <p>
              A carefully selected collection of
              premium technology for modern creators.
            </p>
          </div>

          <div className="products-grid">
            <ProductCard
              image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85"
              category="LAPTOPS"
              name="ProBook X1"
              description="Powerful performance in an incredibly thin aluminum body."
              price="₹89,999"
              oldPrice="₹99,999"
              rating="4.9"
              badge="BESTSELLER"
            />

            <ProductCard
              image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
              category="AUDIO"
              name="AeroSound Pro"
              description="Immersive sound with adaptive noise cancellation."
              price="₹14,999"
              oldPrice="₹17,999"
              rating="4.8"
              badge="NEW"
            />

            <ProductCard
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
              category="WEARABLES"
              name="Pulse One"
              description="Smart health and fitness tracking wrapped in a minimal design."
              price="₹8,499"
              rating="4.7"
            />

            <ProductCard
              image="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85"
              category="DESKTOP"
              name="Studio Keys"
              description="A precision mechanical keyboard built for long sessions."
              price="₹7,999"
              oldPrice="₹9,499"
              rating="4.8"
              badge="POPULAR"
            />
          </div>
        </section>

        {/* Feature section */}

        <section
          className="feature-section"
          id="features"
        >
          <div className="feature-image">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85"
              alt="Laptop workspace"
            />
          </div>

          <div className="feature-content">
            <span className="eyebrow">
              WHY NOVA TECH
            </span>

            <h2>
              Less clutter.
              <br />
              <span>More possibility.</span>
            </h2>

            <p>
              We believe technology should disappear
              into your workflow instead of getting in
              your way.
            </p>

            <div className="feature-list">
              <div>
                <span>01</span>

                <div>
                  <h3>Thoughtful design</h3>
                  <p>
                    Every product is selected for
                    usability, quality and longevity.
                  </p>
                </div>
              </div>

              <div>
                <span>02</span>

                <div>
                  <h3>Built to last</h3>
                  <p>
                    Premium materials and dependable
                    performance come first.
                  </p>
                </div>
              </div>

              <div>
                <span>03</span>

                <div>
                  <h3>Human support</h3>
                  <p>
                    Real people are available whenever
                    you need help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="cta" id="about">
          <div>
            <span className="eyebrow">
              READY WHEN YOU ARE
            </span>

            <h2>
              Upgrade the way
              <span> you work.</span>
            </h2>

            <p>
              Explore our collection and find the
              technology that fits your workflow.
            </p>

            <Button text="Explore Collection" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;