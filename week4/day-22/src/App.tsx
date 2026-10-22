import { useState, type CSSProperties } from "react";

import StudioButton from "../components/StudioButton";
import EmotionBadge from "../components/EmotionBadge";
import StyledPreview from "../components/StyledPreview";
import TokenEditor from "../components/TokenEditor";


const DEFAULT_PRIMARY = "#6c5ce7";
const DEFAULT_RADIUS = 12;

type TokenStyle = CSSProperties & {
  "--color-primary": string;
  "--color-primary-hover": string;
  "--radius-md": string;
};

export default function App() {
  const [primaryColor, setPrimaryColor] =
    useState(DEFAULT_PRIMARY);

  const [radius, setRadius] =
    useState(DEFAULT_RADIUS);

  const appTokens: TokenStyle = {
    "--color-primary": primaryColor,
    "--color-primary-hover": primaryColor,
    "--radius-md": `${radius}px`,
  };

  function resetTokens() {
    setPrimaryColor(DEFAULT_PRIMARY);
    setRadius(DEFAULT_RADIUS);
  }

  return (
    <main className="app-shell" style={appTokens}>
      <header className="hero">
        <div className="brand-mark">P</div>

        <div>
          <p className="eyebrow">
            DAY 22 · STYLING ARCHITECTURE
          </p>

          <h1>
            PixelCraft <span>UI Studio</span>
          </h1>

          <p className="hero-copy">
            A small playground for reusable components
            and design tokens.
          </p>
        </div>
      </header>

      <div className="content-grid">
        <div className="main-column">
          <section className="panel">
            <p className="eyebrow">COMPONENT LIBRARY</p>
            <h2>Button variants</h2>

            <p className="section-copy">
              One typed React component, four consistent
              visual variants.
            </p>

            <div className="button-row">
              <StudioButton
                onClick={() => alert("Primary action!")}
              >
                Primary
              </StudioButton>

              <StudioButton variant="secondary">
                Secondary
              </StudioButton>

              <StudioButton variant="success">
                Success
              </StudioButton>

              <StudioButton variant="danger">
                Danger
              </StudioButton>

              <StudioButton disabled>
                Disabled
              </StudioButton>
            </div>
          </section>

          <section className="panel">
            <p className="eyebrow">CSS-IN-JS</p>
            <h2>Styled component</h2>

            <div style={{ marginTop: 18 }}>
              <StyledPreview $accent={primaryColor} />
            </div>
          </section>

          <section className="panel">
            <p className="eyebrow">EMOTION</p>
            <h2>Status badges</h2>

            <p className="section-copy">
              The same styled component renders different
              statuses using a prop.
            </p>

            <div className="badge-row">
              <EmotionBadge status="success" />
              <EmotionBadge status="warning" />
              <EmotionBadge status="error" />
            </div>
          </section>
        </div>

        <aside className="side-column">
          <TokenEditor
            primaryColor={primaryColor}
            radius={radius}
            onPrimaryColorChange={setPrimaryColor}
            onRadiusChange={setRadius}
            onReset={resetTokens}
          />

          <section className="panel principles">
            <p className="eyebrow">DESIGN SYSTEM</p>
            <h2>Core principles</h2>

            <ul>
              <li>
                <span>01</span>
                <div>
                  <strong>Consistency</strong>
                  <small>Shared tokens and styles</small>
                </div>
              </li>

              <li>
                <span>02</span>
                <div>
                  <strong>Reusability</strong>
                  <small>Build once, use anywhere</small>
                </div>
              </li>

              <li>
                <span>03</span>
                <div>
                  <strong>Accessibility</strong>
                  <small>Focus states and semantic HTML</small>
                </div>
              </li>

              <li>
                <span>04</span>
                <div>
                  <strong>Maintainability</strong>
                  <small>Clear, reusable styling rules</small>
                </div>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <footer>
        PixelCraft UI Studio <span>·</span> Built with React + TypeScript
      </footer>
    </main>
  );
}