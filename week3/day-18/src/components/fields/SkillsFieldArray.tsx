
import { Button, Form, Input, Space, Typography } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

const { Title, Text } = Typography;

export default function SkillsFieldArray() {
  const {
    control,
    formState: { errors },
  } = useFormContext<JobApplicationData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const skillsError = errors.skills;
  const arrayError =
    skillsError && !Array.isArray(skillsError)
      ? skillsError.message
      : undefined;

  return (
    <section className="skills-section">
      <div className="section-heading">
        <div>
          <Title level={4}>Your skills</Title>
          <Text type="secondary">
            Add the skills relevant to your chosen role.
          </Text>
        </div>

        <Text type="secondary">
          {fields.length} {fields.length === 1 ? "skill" : "skills"}
        </Text>
      </div>

      {fields.map((item, index) => (
        <div className="skill-row" key={item.id}>
          <Controller
            name={`skills.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <Form.Item
                className="skill-form-item"
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    {...field}
                    size="large"
                    placeholder={`Skill ${index + 1}, e.g. React`}
                  />

                  <Button
                    size="large"
                    danger
                    icon={<MinusCircleOutlined />}
                    disabled={fields.length === 1}
                    aria-label={`Remove skill ${index + 1}`}
                    onClick={() => remove(index)}
                  />
                </Space.Compact>
              </Form.Item>
            )}
          />
        </div>
      ))}

      {arrayError && (
        <Text type="danger" className="array-error">
          {arrayError}
        </Text>
      )}

      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={() => append({ name: "" })}
      >
        Add another skill
      </Button>
    </section>
  );
}
