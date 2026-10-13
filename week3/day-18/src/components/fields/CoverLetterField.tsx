
import { Controller, useFormContext } from "react-hook-form";
import { Form, Input } from "antd";
import type { JobApplicationData } from "../../schemas/jobApplicationSchema";

const { TextArea } = Input;

export default function CoverLetterField() {
  const { control } = useFormContext<JobApplicationData>();

  return (
    <Controller
      name="coverLetter"
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label="Why should we hire you?"
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
          extra="Minimum 30 characters"
        >
          <TextArea
            {...field}
            rows={5}
            maxLength={1000}
            showCount
            placeholder="Tell us about your strengths, projects, and experience..."
          />
        </Form.Item>
      )}
    />
  );
}
