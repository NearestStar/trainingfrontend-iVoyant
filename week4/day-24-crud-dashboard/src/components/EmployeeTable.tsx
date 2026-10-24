
import {
  Avatar,
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Employee } from "../types/employee";

const { Text } = Typography;

interface Props {
  employees: Employee[];
  loading: boolean;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({
  employees,
  loading,
  selectedIds,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: ColumnsType<Employee> = [
    {
      title: "EMPLOYEE",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, employee) => (
        <Space size={11}>
          <Avatar
            className="employee-avatar"
            style={{
              background: "#eeebff",
              color: "#5b4ce2",
              fontWeight: 700,
            }}
          >
            {employee.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{employee.name}</Text>
            <br />
            <Text type="secondary" className="employee-email">
              {employee.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "DEPARTMENT",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      render: (department: string) => (
        <Tag className="department-tag">{department}</Tag>
      ),
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      key: "location",
      responsive: ["md"],
    },
    {
      title: "MONTHLY SALARY",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (salary: number) => (
        <Text strong>₹{salary.toLocaleString("en-IN")}</Text>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Employee["status"]) => (
        <Tag
          color={status === "Active" ? "success" : "default"}
          bordered={false}
        >
          <span className="status-dot" />
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      fixed: "right",
      width: 130,
      render: (_, employee) => (
        <Space size={2}>
          <Tooltip title="View details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              aria-label={`View ${employee.name}`}
              onClick={() => onView(employee)}
            />
          </Tooltip>

          <Tooltip title="Edit employee">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`Edit ${employee.name}`}
              onClick={() => onEdit(employee)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete employee?"
            description={`Remove ${employee.name} permanently?`}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(employee.id)}
          >
            <Tooltip title="Delete employee">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={`Delete ${employee.name}`}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Employee>
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={loading}
      rowSelection={{
        selectedRowKeys: selectedIds,
        onChange: (keys) => onSelectionChange(keys.map(Number)),
      }}
      pagination={{
        defaultPageSize: 8,
        showSizeChanger: true,
        pageSizeOptions: ["8", "15", "25"],
        showTotal: (total) => `${total} employees`,
      }}
      scroll={{ x: 950 }}
      locale={{ emptyText: "No employees match your filters." }}
    />
  );
}
