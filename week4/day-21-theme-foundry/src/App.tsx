import { useMemo, useState, type CSSProperties } from "react";
import {
  App as AntApp,
  Button,
  ConfigProvider,
  Segmented,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme as antdTheme,
  type ThemeConfig,
} from "antd";
import {
  AppstoreOutlined,
  CodeOutlined,
  EyeOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import TokenControls, { type DesignTokens } from "./components/TokenControls";
import ComponentPreview from "./components/ComponentPreview";
import TokenJson from "./components/TokenJson";
import { themePresets, type ThemePreset } from "./theme/presets";

const { Title, Text } = Typography;

const initialTokens: DesignTokens = {
  colorPrimary: "#7457E8",
  borderRadius: 12,
  fontSize: 14,
  controlHeight: 38,
};

export default function App() {
  const [tokens, setTokens] = useState<DesignTokens>(initialTokens);
  const [activePreset, setActivePreset] = useState("Iris");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [view, setView] = useState<"preview" | "tokens">("preview");

  const themeConfig = useMemo<ThemeConfig>(
    () => ({
      algorithm: [
        darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        ...(compactMode ? [antdTheme.compactAlgorithm] : []),
      ],
      token: {
        colorPrimary: tokens.colorPrimary,
        borderRadius: tokens.borderRadius,
        fontSize: tokens.fontSize,
        controlHeight: tokens.controlHeight,
        colorSuccess: "#16a34a",
        colorWarning: "#d97706",
        colorError: "#dc4c64",
        wireframe: false,
      },
      components: {
        Button: {
          borderRadius: tokens.borderRadius,
          controlHeight: tokens.controlHeight,
        },
        Input: {
          borderRadius: tokens.borderRadius,
          controlHeight: tokens.controlHeight,
        },
      },
    }),
    [tokens, darkMode, compactMode],
  );

  function handleTokenChange(nextTokens: DesignTokens) {
    setTokens(nextTokens);
    if (nextTokens.colorPrimary !== tokens.colorPrimary) {
      setActivePreset("Custom");
    }
  }

  function handlePresetChange(preset: ThemePreset) {
    setTokens((current) => ({ ...current, colorPrimary: preset.primary }));
    setActivePreset(preset.name);
  }

  function resetTheme() {
    setTokens(initialTokens);
    setActivePreset("Iris");
    setDarkMode(false);
    setCompactMode(false);
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <div className={`app-shell ${darkMode ? "dark-shell" : "light-shell"}`} style={{ "--preview-primary": tokens.colorPrimary } as CSSProperties}>
          <header className="topbar">
            <div className="brand-lockup">
              <div className="brand-symbol"><span /></div>
              <div>
                <Title level={4} className="brand-title">theme<span>foundry</span></Title>
                <Text className="brand-subtitle">A design system playground</Text>
              </div>
            </div>
            <div className="topbar-right">
              <Tag bordered={false} color="success" className="live-tag"><span className="live-dot" /> LIVE PREVIEW</Tag>
              <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <Button
                  shape="circle"
                  aria-label="Toggle dark mode"
                  icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={() => setDarkMode((current) => !current)}
                />
              </Tooltip>
              <Button type="primary" icon={<CodeOutlined />} onClick={() => setView("tokens")}>View tokens</Button>
            </div>
          </header>

          <div className="page-intro">
            <div>
              <Text className="eyebrow">DESIGN ENGINEERING / PLAYGROUND 01</Text>
              <Title className="page-title">Shape the system.<br /><span>Not every component.</span></Title>
              <Text className="page-description">Tune a handful of design tokens and see them ripple through a complete component library.</Text>
            </div>
            <div className="intro-meta">
              <div className="meta-line"><span className="meta-dot purple" /> <Text type="secondary">Ant Design</Text></div>
              <div className="meta-line"><span className="meta-dot green" /> <Text type="secondary">Token-driven styling</Text></div>
              <div className="meta-line"><span className="meta-dot amber" /> <Text type="secondary">Live configuration</Text></div>
            </div>
          </div>

          <div className="workspace">
            <TokenControls
              tokens={tokens}
              onChange={handleTokenChange}
              presets={themePresets}
              activePreset={activePreset}
              onPresetChange={handlePresetChange}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              compactMode={compactMode}
              onCompactModeChange={setCompactMode}
              onReset={resetTheme}
            />

            <main className="canvas-area">
              <div className="canvas-toolbar">
                <Space size={8}>
                  <AppstoreOutlined />
                  <Text strong>Workspace</Text>
                  <Text type="secondary">/</Text>
                  <Text type="secondary">Component laboratory</Text>
                </Space>
                <Segmented
                  value={view}
                  onChange={(value) => setView(value as "preview" | "tokens")}
                  options={[
                    { label: "Live preview", value: "preview", icon: <EyeOutlined /> },
                    { label: "Token JSON", value: "tokens", icon: <CodeOutlined /> },
                  ]}
                />
              </div>

              {view === "preview" ? <ComponentPreview /> : <TokenJson tokens={tokens} darkMode={darkMode} />}

              <footer className="canvas-footer">
                <Text type="secondary">Built with Ant Design · Theme values update in real time</Text>
                <Text type="secondary">Theme Foundry <span className="footer-version">v1.0</span></Text>
              </footer>
            </main>
          </div>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}
