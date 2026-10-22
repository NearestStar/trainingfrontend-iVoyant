import StudioButton from "./StudioButton";

type TokenEditorProps = {
  primaryColor: string;
  radius: number;
  onPrimaryColorChange: (color: string) => void;
  onRadiusChange: (radius: number) => void;
  onReset: () => void;
};

export default function TokenEditor({
  primaryColor,
  radius,
  onPrimaryColorChange,
  onRadiusChange,
  onReset,
}: TokenEditorProps) {
  return (
    <section className="panel token-editor">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CUSTOMIZE</p>
          <h2>Design tokens</h2>
        </div>

        <StudioButton variant="secondary" onClick={onReset}>
          Reset
        </StudioButton>
      </div>

      <label className="control">
        <span>Primary color</span>

        <div className="color-control">
          <input
            aria-label="Choose primary color"
            type="color"
            value={primaryColor}
            onChange={(event) =>
              onPrimaryColorChange(event.target.value)
            }
          />

          <code>{primaryColor.toUpperCase()}</code>
        </div>
      </label>

      <label className="control">
        <span>
          Border radius <strong>{radius}px</strong>
        </span>

        <input
          type="range"
          min="4"
          max="28"
          step="2"
          value={radius}
          onChange={(event) =>
            onRadiusChange(Number(event.target.value))
          }
        />

        <span className="range-labels">
          <small>Sharper</small>
          <small>Rounder</small>
        </span>
      </label>
    </section>
  );
}