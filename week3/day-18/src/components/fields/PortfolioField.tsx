
import { Controller, useFormContext } from "react-hook-form";
import { Form, Input } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

export default function PortfolioField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="portfolio"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Portfolio URL (optional)"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
        >
          <Input
            {...field}
            size="large"
            type="url"
            placeholder="https://yourportfolio.com"
          />
        </Form.Item>
      )}
    />
  );
}
