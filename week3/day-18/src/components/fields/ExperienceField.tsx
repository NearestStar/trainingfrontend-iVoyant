
import { Controller, useFormContext } from "react-hook-form";
import { Form, Select } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

const options = [
  { label: "Fresher", value: "Fresher" },
  { label: "0–2 years", value: "0-2 years" },
  { label: "3–5 years", value: "3-5 years" },
  { label: "5+ years", value: "5+ years" },
];

export default function ExperienceField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="experience"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Experience level"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Select
            size="large"
            placeholder="Select experience"
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
