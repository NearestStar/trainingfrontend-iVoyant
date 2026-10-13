
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Typography,
  message,
} from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  jobApplicationSchema,
  type JobApplicationData,
} from "../schemas/jobApplicationSchema";

import FullNameField from "./fields/FullNameField";
import EmailField from "./fields/EmailField";
import PhoneField from "./fields/PhoneField";
import PositionField from "./fields/PositionField";
import ExperienceField from "./fields/ExperienceField";
import PortfolioField from "./fields/PortfolioField";
import CoverLetterField from "./fields/CoverLetterField";
import SkillsFieldArray from "./fields/SkillsFieldArray";

const { Title, Text, Paragraph } = Typography;

export default function JobApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const methods = useForm<JobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      portfolio: "",
      coverLetter: "",
      skills: [{ name: "" }],
    },
  });

  const values = useWatch({
    control: methods.control,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const skills = values.skills ?? [];

  const completedFields = [
    (values.fullName ?? "").trim().length >= 3,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email ?? ""),
    /^\d{10}$/.test(values.phone ?? ""),
    Boolean(values.position),
    Boolean(values.experience),
    (values.coverLetter ?? "").trim().length >= 30,
    skills.length > 0 &&
      skills.every((skill) => (skill.name ?? "").trim().length >= 2)
  ].filter(Boolean).length;

  const progress = Math.round((completedFields / 7) * 100);

  async function onSubmit(data: JobApplicationData) {
    // Simulate a server request.
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Validated application:", data);
    setSubmitted(true);
    messageApi.success("Application validated successfully!");
  }

  function onInvalid() {
    console.log("Validation errors:", methods.formState.errors);
    console.log("Current values:", methods.getValues());
    messageApi.error("Please correct the highlighted fields.");
  }

  function startNewApplication() {
    reset();
    setSubmitted(false);
  }

  return (
    <div className="app-shell">
      {contextHolder}

      <header className="topbar">
        <div className="brand-mark">C</div>

        <div className="brand-copy">
          <Text strong>CareerCraft</Text>
          <Text type="secondary">CAREER PORTAL</Text>
        </div>

        <div className="secure-label">
          <SafetyCertificateOutlined /> Secure application
        </div>
      </header>

      <main className="main-content">
        <div className="hero">
          <Text className="eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </Text>

          <Title>Let's get to know you.</Title>

          <Paragraph>
            Showcase your skills, tell us your story, and take the
            next step toward your dream opportunity.
          </Paragraph>
        </div>

        {submitted ? (
          <Card className="application-card success-card">
            <CheckCircleFilled className="success-icon" />

            <Title level={2}>Application complete!</Title>

            <Paragraph>
              Your details passed validation. This demo does not send
              your application to a real hiring server.
            </Paragraph>

            <Button type="primary" size="large" onClick={startNewApplication}>
              Create another application
            </Button>
          </Card>
        ) : (
          <Card className="application-card">
            <div className="progress-header">
              <Text strong>Application progress</Text>
              <Text type="secondary">{progress}% complete</Text>
            </div>

            <Progress
              percent={progress}
              showInfo={false}
              strokeColor={{
                "0%": "#8c72f6",
                "100%": "#5b42cc",
              }}
            />

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                noValidate
              >
                <div className="form-section-heading">
                  <Text className="step-label">STEP 01</Text>
                  <Title level={4}>Personal information</Title>
                  <Text type="secondary">
                    Tell us how to reach you and which role interests you.
                  </Text>
                </div>

                <Row gutter={[20, 0]}>
                  <Col xs={24} md={12}>
                    <FullNameField />
                  </Col>

                  <Col xs={24} md={12}>
                    <EmailField />
                  </Col>

                  <Col xs={24} md={12}>
                    <PhoneField />
                  </Col>

                  <Col xs={24} md={12}>
                    <PositionField />
                  </Col>

                  <Col xs={24} md={12}>
                    <ExperienceField />
                  </Col>

                  <Col xs={24} md={12}>
                    <PortfolioField />
                  </Col>
                </Row>

                <div className="section-divider" />

                <SkillsFieldArray />

                <div className="section-divider" />

                <div className="form-section-heading">
                  <Text className="step-label">STEP 02</Text>
                  <Title level={4}>Tell us your story</Title>
                  <Text type="secondary">
                    What makes you a great fit for this role?
                  </Text>
                </div>

                <CoverLetterField />

                {Object.keys(errors).length > 0 && (
                  <Alert
                    className="validation-alert"
                    type="warning"
                    showIcon
                    message="Some fields need attention"
                    description="Review the highlighted fields before submitting."
                  />
                )}

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isSubmitting}
                  icon={!isSubmitting ? <ArrowRightOutlined /> : undefined}
                  iconPosition="end"
                >
                  {isSubmitting
                    ? "Validating application..."
                    : "Submit application"}
                </Button>

                <Text className="privacy-note">
                  Your information stays in this demo. No real application
                  is sent.
                </Text>
              </form>
            </FormProvider>
          </Card>
        )}
      </main>

      <footer className="page-footer">
        Built for your next big opportunity.
      </footer>
    </div>
  );
}
