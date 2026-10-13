
import { Controller, useFormContext } from "react-hook-form";
import { Form, Input } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

export default function PhoneField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Phone number"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Input
            {...field}
            size="large"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            autoComplete="tel"
          />
        </Form.Item>
      )}
    />
  );
}
