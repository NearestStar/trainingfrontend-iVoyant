import { useState, type ReactNode } from "react";
import {
  Button,
  ColorPicker,
  Divider,
  Segmented,
  Slider,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ThemePreset } from "../theme/presets";

const { Text } = Typography;

export interface DesignTokens {
  colorPrimary: string;
  borderRadius: number;
  fontSize: number;
  controlHeight: number;
}

interface TokenControlsProps {
  tokens: DesignTokens;
  onChange: (tokens: DesignTokens) => void;
  presets: ThemePreset[];
  activePreset: string;
  onPresetChange: (preset: ThemePreset) => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  compactMode: boolean;
  onCompactModeChange: (value: boolean) => void;
  onReset: () => void;
}

function TokenRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="token-control-row">
      <div className="token-control-label">
        <Text strong>{label}</Text>
        <Text type="secondary" className="token-value">
          {value}
        </Text>
      </div>
      {children}
    </div>
  );
}

export default function TokenControls({
  tokens,
  onChange,
  presets,
  activePreset,
  onPresetChange,
  darkMode,
  onDarkModeChange,
  compactMode,
  onCompactModeChange,
  onReset,
}: TokenControlsProps) {
  const [showAllPresets, setShowAllPresets] = useState(true);

  return (
    <aside className="controls-panel">
      <div className="panel-heading">
        <div>
          <Text className="eyebrow">DESIGN SYSTEM</Text>
          <Typography.Title level={4}>Tokens</Typography.Title>
          <Text type="secondary">Tune the foundations of your UI.</Text>
        </div>
        <Tooltip title="Reset all values">
          <Button
            aria-label="Reset theme"
            icon={<ReloadOutlined />}
            onClick={onReset}
          />
        </Tooltip>
      </div>

      <Divider />

      <div className="controls-section">
        <div className="section-title-row">
          <Text strong>Color palette</Text>
          <Button
            type="link"
            size="small"
            onClick={() => setShowAllPresets((current) => !current)}
          >
            {showAllPresets ? "Hide presets" : "Show presets"}
          </Button>
        </div>
        <div className="primary-color-row">
          <ColorPicker
            value={tokens.colorPrimary}
            showText={false}
            format="hex"
            onChangeComplete={(color) =>
              onChange({
                ...tokens,
                colorPrimary: color.toHexString(),
              })
            }
          />
          <div className="color-description">
            <Text strong>{tokens.colorPrimary.toUpperCase()}</Text>
            <Text type="secondary">Primary seed token</Text>
          </div>
        </div>

        {showAllPresets && (
          <div className="preset-grid">
            {presets.map((preset) => (
              <Tooltip title={preset.description} key={preset.name}>
                <button
                  type="button"
                  className={`preset-swatch ${activePreset === preset.name ? "selected" : ""}`}
                  onClick={() => onPresetChange(preset)}
                  aria-label={`Apply ${preset.name} preset`}
                  aria-pressed={activePreset === preset.name}
                >
                  <span
                    className="swatch-color"
                    style={{ background: preset.primary }}
                  />
                  <span className="swatch-name">{preset.name}</span>
                  {activePreset === preset.name && (
                    <CheckOutlined className="swatch-check" />
                  )}
                </button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      <Divider />

      <div className="controls-section">
        <Text strong>Shape & typography</Text>
        <TokenRow label="Border radius" value={`${tokens.borderRadius}px`}>
          <Slider
            min={0}
            max={24}
            step={2}
            value={tokens.borderRadius}
            onChange={(value) => onChange({ ...tokens, borderRadius: value })}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </TokenRow>
        <TokenRow label="Base font size" value={`${tokens.fontSize}px`}>
          <Slider
            min={12}
            max={20}
            step={1}
            value={tokens.fontSize}
            onChange={(value) => onChange({ ...tokens, fontSize: value })}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </TokenRow>
        <TokenRow label="Control height" value={`${tokens.controlHeight}px`}>
          <Slider
            min={28}
            max={48}
            step={2}
            value={tokens.controlHeight}
            onChange={(value) => onChange({ ...tokens, controlHeight: value })}
            tooltip={{ formatter: (value) => `${value}px` }}
          />
        </TokenRow>
      </div>

      <Divider />

      <div className="controls-section">
        <Text strong>Appearance</Text>
        <div className="setting-row">
          <div className="setting-copy">
            <Text>Dark theme</Text>
            <Text type="secondary">Switch the preview mode</Text>
          </div>
          <Switch checked={darkMode} onChange={onDarkModeChange} />
        </div>
        <div className="setting-row">
          <div className="setting-copy">
            <Text>Compact density</Text>
            <Text type="secondary">Tighter component spacing</Text>
          </div>
          <Switch checked={compactMode} onChange={onCompactModeChange} />
        </div>
        <Segmented
          block
          value={darkMode ? "Dark" : "Light"}
          options={["Light", "Dark"]}
          onChange={(value) => onDarkModeChange(value === "Dark")}
        />
      </div>

      <div className="controls-footer">
        <Space size={6}>
          <span className="online-dot" />
          <Text type="secondary">Live theme updates enabled</Text>
        </Space>
      </div>
    </aside>
  );
}
