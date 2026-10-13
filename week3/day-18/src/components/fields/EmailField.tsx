
import { Controller, useFormContext } from "react-hook-form";
import { Form, Input } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

export default function EmailField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="email"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Email address"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Input
            {...field}
            size="large"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Item>
      )}
    />
  );
}
