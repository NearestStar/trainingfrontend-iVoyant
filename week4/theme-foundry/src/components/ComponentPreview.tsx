import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  HeartOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function ComponentPreview() {
  return (
    <div className="preview-content">
      <div className="preview-heading">
        <div>
          <Text className="eyebrow">LIVE CANVAS</Text>
          <Title level={3}>Component preview</Title>
          <Paragraph type="secondary">
            Adjust the tokens on the left and watch the components respond instantly.
          </Paragraph>
        </div>
        <Tag color="success" bordered={false} icon={<CheckCircleFilled />}>
          Live preview
        </Tag>
      </div>

      <Card className="hero-card" bordered={false}>
        <div className="hero-card-content">
          <div className="hero-copy">
            <Tag color="blue" bordered={false}>DESIGN SYSTEM / 01</Tag>
            <Title level={2}>Good design feels effortless.</Title>
            <Paragraph>
              A small collection of components, one thoughtful system. Explore how a few shared tokens can shape an entire interface.
            </Paragraph>
            <Space wrap>
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                Explore components
              </Button>
              <Button size="large" icon={<HeartOutlined />}>
                Save collection
              </Button>
            </Space>
          </div>
          <div className="hero-orb-wrap" aria-hidden="true">
            <div className="hero-orb hero-orb-one" />
            <div className="hero-orb hero-orb-two" />
            <div className="hero-orb hero-orb-three" />
            <div className="hero-orb-center"><StarFilled /></div>
          </div>
        </div>
        <div className="hero-card-footer">
          <div><Text type="secondary">System status</Text><div><Badge status="success" text="All components synced" /></div></div>
          <div><Text type="secondary">Last updated</Text><div><Text strong>Just now</Text></div></div>
          <div><Text type="secondary">Token set</Text><div><Text strong>Foundations v1.4</Text></div></div>
        </div>
      </Card>

      <Row gutter={[16, 16]} className="component-grid">
        <Col xs={24} xl={14}>
          <Card className="preview-card" title={<span>Buttons & inputs <Text type="secondary" className="card-kicker">/ INTERACTIONS</Text></span>}>
            <Space wrap className="button-gallery">
              <Button type="primary">Primary action</Button>
              <Button>Secondary</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="text">Text action</Button>
              <Button type="primary" danger>Delete</Button>
              <Button type="primary" icon={<PlusOutlined />}>Create new</Button>
            </Space>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12}>
                <Text className="field-label">Project name</Text>
                <Input placeholder="e.g. Aurora interface" prefix={<SearchOutlined />} />
              </Col>
              <Col xs={24} md={12}>
                <Text className="field-label">Design system</Text>
                <Select
                  style={{ width: "100%" }}
                  defaultValue="foundation"
                  options={[
                    { value: "foundation", label: "Foundation kit" },
                    { value: "commerce", label: "Commerce UI" },
                    { value: "editorial", label: "Editorial system" },
                  ]}
                />
              </Col>
              <Col xs={24} md={12}>
                <Text className="field-label">Review date</Text>
                <DatePicker style={{ width: "100%" }} placeholder="Choose a date" />
              </Col>
              <Col xs={24} md={12} className="switch-example">
                <div><Text strong>Publish changes</Text><Text type="secondary">Make this system available to your team</Text></div>
                <Switch defaultChecked />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="preview-card" title={<span>Status & feedback <Text type="secondary" className="card-kicker">/ STATES</Text></span>}>
            <Space wrap size={[8, 8]} className="tag-gallery">
              <Tag color="success">Published</Tag>
              <Tag color="processing">In review</Tag>
              <Tag color="warning">Draft</Tag>
              <Tag color="error">Blocked</Tag>
              <Tag bordered={false} color="purple">Experiment</Tag>
            </Space>
            <Divider />
            <Alert
              type="success"
              showIcon
              message="All systems looking good"
              description="Your current token configuration is applied across the canvas."
              className="feedback-alert"
            />
            <div className="progress-block">
              <div className="progress-label"><Text strong>System coverage</Text><Text type="secondary">86%</Text></div>
              <Progress percent={86} showInfo={false} />
              <div className="progress-label"><Text strong>Accessibility review</Text><Text type="secondary">64%</Text></div>
              <Progress percent={64} status="active" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card className="preview-card team-card" title={<span>People behind the pixels <Text type="secondary" className="card-kicker">/ COLLABORATION</Text></span>} extra={<Button type="link">View team</Button>}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Space size={12} align="center">
                  <Avatar size={44} style={{ background: "#7965db" }}>AM</Avatar>
                  <div><Text strong>Alex Morgan</Text><div><Text type="secondary">Product designer</Text></div></div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space size={12} align="center">
                  <Avatar size={44} style={{ background: "#0f8b8d" }}>JR</Avatar>
                  <div><Text strong>Jamie Rivera</Text><div><Text type="secondary">Frontend engineer</Text></div></div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space size={12} align="center">
                  <Avatar size={44} style={{ background: "#d97706" }}>SK</Avatar>
                  <div><Text strong>Sam Kim</Text><div><Text type="secondary">Design systems</Text></div></div>
                </Space>
              </Col>
            </Row>
            <Divider />
            <div className="team-bottom-row">
              <Space><CalendarOutlined /><Text type="secondary">Next review: Thursday, 10:30 AM</Text></Space>
              <Tooltip title="Notifications are enabled"><Button shape="circle" icon={<BellOutlined />} /></Tooltip>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
