
import { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import type { Employee, EmployeeInput } from "../types/employee";

interface Props {
  open: boolean;
  employee: Employee | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: EmployeeInput) => Promise<void>;
}

const departments = [
  "Engineering",
  "Design",
  "Product",
  "Human Resources",
  "Marketing",
  "Finance",
];

export default function EmployeeFormModal({
  open,
  employee,
  saving,
  onCancel,
  onSave,
}: Props) {
  const [form] = Form.useForm<EmployeeInput>();

  useEffect(() => {
    if (!open) return;

    if (employee) {
      form.setFieldsValue({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        location: employee.location,
        salary: employee.salary,
        status: employee.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Active" });
    }
  }, [open, employee, form]);

  return (
    <Modal
      title={employee ? "Edit employee" : "Add new employee"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={employee ? "Save changes" : "Create employee"}
      confirmLoading={saving}
      destroyOnClose
      width={600}
    >
      <p className="modal-description">
        {employee
          ? "Update the employee information."
          : "Add a new member to your organization."}
      </p>

      <Form<EmployeeInput>
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={onSave}
      >
        <Form.Item
          name="name"
          label="Full name"
          rules={[
            { required: true, message: "Enter the employee's name" },
            { min: 2, message: "Enter at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g. Aarav Sharma" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Enter an email address" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="name@company.com" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Job title"
          rules={[{ required: true, message: "Enter a job title" }]}
        >
          <Input placeholder="e.g. Frontend Developer" />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Select a department" }]}
        >
          <Select
            placeholder="Choose department"
            options={departments.map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Enter a location" }]}
        >
          <Input placeholder="e.g. Bengaluru" />
        </Form.Item>

        <Form.Item
          name="salary"
          label="Monthly salary (₹)"
          rules={[
            { required: true, message: "Enter a salary" },
            {
              type: "number",
              min: 1,
              message: "Salary must be greater than zero",
            },
          ]}
        >
          <InputNumber
            min={1}
            precision={0}
            style={{ width: "100%" }}
            placeholder="Enter monthly salary"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Employment status"
          rules={[{ required: true, message: "Select a status" }]}
        >
          <Select
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
