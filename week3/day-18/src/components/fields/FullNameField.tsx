import { Controller, useFormContext } from "react-hook-form";
import { Form, Input } from "antd";

import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

export default function FullNameField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="fullName"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Full name"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Input
            {...field}
            size="large"
            placeholder="Enter your full name"
          />
        </Form.Item>
      )}
    />
  );
}