
import { Controller, useFormContext } from "react-hook-form";
import { Form, Select } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

const options = [
  { label: "Frontend Developer", value: "Frontend Developer" },
  { label: "Backend Developer", value: "Backend Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
];

export default function PositionField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="position"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Position applying for"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Select
            size="large"
            placeholder="Choose a position"
            options={options}
            value={field.value || undefined}
            onChange={(value) => field.onChange(value ?? "")}
            onBlur={field.onBlur}
            ref={field.ref}
            allowClear
          />
        </Form.Item>
      )}
    />
  );
}
