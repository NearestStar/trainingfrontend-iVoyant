import { Button, Card, Space, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import type { DesignTokens } from "./TokenControls";

const { Text, Title } = Typography;

interface TokenJsonProps {
  tokens: DesignTokens;
  darkMode: boolean;
}

export default function TokenJson({ tokens, darkMode }: TokenJsonProps) {
  const tokenOutput = JSON.stringify(
    {
      token: {
        colorPrimary: tokens.colorPrimary,
        borderRadius: tokens.borderRadius,
        fontSize: tokens.fontSize,
        controlHeight: tokens.controlHeight,
      },
    },
    null,
    2,
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tokenOutput);
      message.success("Theme tokens copied");
    } catch {
      message.error("Clipboard access was blocked by your browser");
    }
  }

  return (
    <Card className={`token-json-card ${darkMode ? "json-dark" : ""}`} bordered={false}>
      <div className="json-heading">
        <div>
          <Text className="eyebrow">READY TO USE</Text>
          <Title level={4}>Theme configuration</Title>
          <Text type="secondary">The current token values, ready to use in ConfigProvider.</Text>
        </div>
        <Button icon={<CopyOutlined />} onClick={handleCopy}>Copy JSON</Button>
      </div>
      <pre className="token-code"><code>{tokenOutput}</code></pre>
      <Space wrap size={6}>
        <Text type="secondary">Export format</Text>
        <Text code>ThemeConfig</Text>
        <Text type="secondary">·</Text>
        <Text type="secondary">Ant Design</Text>
      </Space>
    </Card>
  );
}
