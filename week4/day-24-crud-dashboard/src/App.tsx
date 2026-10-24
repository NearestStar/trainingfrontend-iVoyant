
import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Layout,
  Menu,
  message,
  Popconfirm,
  Popover,
  Progress,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import EmployeeFormModal from "./components/EmployeeFormModal";
import EmployeeTable from "./components/EmployeeTable";
import {
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from "./services/employeeApi";
import type { Employee, EmployeeInput } from "./types/employee";
import "./App.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type Page = "overview" | "employees" | "departments";

const departmentNames = [
  "Engineering",
  "Design",
  "Product",
  "Human Resources",
  "Marketing",
  "Finance",
];

function downloadCSV(employees: Employee[]) {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Department",
    "Location",
    "Monthly Salary",
    "Status",
  ];

  const escapeCSV = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const rows = employees.map((employee) =>
    [
      employee.id,
      employee.name,
      employee.email,
      employee.role,
      employee.department,
      employee.location,
      employee.salary,
      employee.status,
    ]
      .map(escapeCSV)
      .join(",")
  );

  const csv = [headers.map(escapeCSV).join(","), ...rows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "northstar-employees.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function App() {
  const [messageApi, messageContext] = message.useMessage();

  const {
    data: employees = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetEmployeesQuery();

  const [addEmployee, { isLoading: isAdding }] =
    useAddEmployeeMutation();

  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  const [activePage, setActivePage] = useState<Page>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] =
    useState<Employee | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveCount = employees.length - activeCount;

  const activePercentage = employees.length
    ? Math.round((activeCount / employees.length) * 100)
    : 0;

  const departmentsCount = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const totalPayroll = employees
    .filter((employee) => employee.status === "Active")
    .reduce((sum, employee) => sum + employee.salary, 0);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const searchableFields = [
        employee.name,
        employee.email,
        employee.role,
        employee.department,
        employee.location,
      ];

      const matchesSearch = searchableFields.some((field) =>
        field.toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, search, statusFilter, departmentFilter]);

  const departmentStats = departmentNames.map((name) => {
    const departmentEmployees = employees.filter(
      (employee) => employee.department === name
    );

    return {
      name,
      count: departmentEmployees.length,
      active: departmentEmployees.filter(
        (employee) => employee.status === "Active"
      ).length,
    };
  });

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setSelectedIds([]);
  };

  const navigate = (page: Page) => {
    setActivePage(page);
    resetFilters();
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async (values: EmployeeInput) => {
    try {
      if (selectedEmployee) {
        await updateEmployee({
          id: selectedEmployee.id,
          data: values,
        }).unwrap();

        messageApi.success("Employee updated successfully.");
      } else {
        await addEmployee(values).unwrap();
        messageApi.success("Employee created successfully.");
      }

      closeModal();
    } catch {
      messageApi.error(
        "Could not save employee. Check the API connection and try again."
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id).unwrap();

      setSelectedIds((ids) =>
        ids.filter((selectedId) => selectedId !== id)
      );

      if (viewEmployee?.id === id) {
        setViewEmployee(null);
      }

      messageApi.success("Employee deleted successfully.");
    } catch {
      messageApi.error("Could not delete employee. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const ids = [...selectedIds];

    const results = await Promise.allSettled(
      ids.map((id) => deleteEmployee(id).unwrap())
    );

    const successfulIds = ids.filter(
      (_, index) => results[index].status === "fulfilled"
    );

    const failedCount = results.length - successfulIds.length;

    setSelectedIds((current) =>
      current.filter((id) => !successfulIds.includes(id))
    );

    if (failedCount === 0) {
      messageApi.success(`${successfulIds.length} employees deleted.`);
    } else {
      messageApi.warning(
        `${successfulIds.length} deleted; ${failedCount} could not be deleted.`
      );
    }
  };

  const exportEmployees = () => {
    if (filteredEmployees.length === 0) {
      messageApi.warning("There are no employees to export.");
      return;
    }

    downloadCSV(filteredEmployees);
    messageApi.success(
      `Exported ${filteredEmployees.length} employee records.`
    );
  };

  const notificationContent = (
    <div className="notification-panel">
      <Title level={5}>Workspace notifications</Title>

      <div className="notification-item">
        <CheckCircleOutlined className="notification-icon" />
        <div>
          <Text strong>Employee records</Text>
          <Text type="secondary">
            {employees.length} employee records available.
          </Text>
        </div>
      </div>

      {inactiveCount > 0 && (
        <div className="notification-item">
          <ClockCircleOutlined className="notification-icon warning" />
          <div>
            <Text strong>Inactive employees</Text>
            <Text type="secondary">
              {inactiveCount} employees are currently inactive.
            </Text>
          </div>
        </div>
      )}

      {isError && (
        <Alert
          type="error"
          showIcon
          message="API connection error"
          description="Start JSON Server to reload employee records."
        />
      )}

      <Button
        block
        onClick={() => {
          setNotificationsOpen(false);
          setActivePage("employees");
          setSearch("");
          setDepartmentFilter("All");
          setStatusFilter("Inactive");
          setSelectedIds([]);
        }}
      >
        Review inactive employees
      </Button>
    </div>
  );

  return (
    <>
      {messageContext}

      <Layout className="app-shell">
        <Sider
          width={244}
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          className="sidebar"
        >
          <div className="brand">
            <div className="brand-icon">
              <AppstoreOutlined />
            </div>

            <div>
              <span className="brand-name">NORTHSTAR</span>
              <span className="brand-caption">WORKSPACE</span>
            </div>
          </div>

          <Text className="nav-heading">WORKSPACE</Text>

          <Menu
            mode="inline"
            selectedKeys={[activePage]}
            onClick={({ key }) => navigate(key as Page)}
            items={[
              {
                key: "overview",
                icon: <AppstoreOutlined />,
                label: "Overview",
              },
              {
                key: "employees",
                icon: <TeamOutlined />,
                label: "Employees",
              },
              {
                key: "departments",
                icon: <UserOutlined />,
                label: "Departments",
              },
            ]}
          />

          <div className="sidebar-bottom">
            <div className="help-card">
              <div className="help-icon">
                <CheckCircleOutlined />
              </div>
              <Text strong>Workspace status</Text>
              <Text type="secondary">
                {isError
                  ? "API needs attention."
                  : "Your workspace is ready."}
              </Text>
            </div>

            <div className="profile">
              <Avatar
                style={{ background: "#e7e8ff", color: "#5148d9" }}
              >
                AD
              </Avatar>

              <div className="profile-info">
                <Text strong>Admin User</Text>
                <Text type="secondary">Administrator</Text>
              </div>
            </div>
          </div>
        </Sider>

        <Layout>
          <Header className="topbar">
            <div>
              <Text type="secondary">Workspace</Text>
              <Text className="breadcrumb-separator"> / </Text>
              <Text strong>
                {activePage === "overview"
                  ? "Overview"
                  : activePage === "employees"
                    ? "Employees"
                    : "Departments"}
              </Text>
            </div>

            <Space size={14}>
              <span
                className={`connection-dot ${isError ? "offline" : ""}`}
              />

              <Text type="secondary" className="connection-label">
                {isError ? "API disconnected" : "API connected"}
              </Text>

              <Popover
                trigger="click"
                placement="bottomRight"
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
                content={notificationContent}
              >
                <Tooltip title="Notifications">
                  <Button
                    type="text"
                    shape="circle"
                    aria-label="Open notifications"
                    icon={
                      <Badge dot={isError || inactiveCount > 0}>
                        <BellOutlined />
                      </Badge>
                    }
                  />
                </Tooltip>
              </Popover>
            </Space>
          </Header>

          <Content className="dashboard-content">
            <div className="page-heading">
              <div>
                <Text className="eyebrow">PEOPLE & OPERATIONS</Text>

                <Title level={2}>
                  {activePage === "overview"
                    ? "Your team at a glance"
                    : activePage === "employees"
                      ? "Employee management"
                      : "Department directory"}
                </Title>

                <Text type="secondary">
                  {activePage === "departments"
                    ? "Explore teams and workforce distribution."
                    : "Manage employee records and keep your workforce organized."}
                </Text>
              </div>

              <Space wrap>
                <Button
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={exportEmployees}
                >
                  Export CSV
                </Button>

                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={openAddModal}
                >
                  Add employee
                </Button>
              </Space>
            </div>

            {activePage === "overview" && (
              <div className="welcome-banner">
                <div>
                  <Text className="banner-label">
                    WORKFORCE OVERVIEW
                  </Text>

                  <Title level={3}>
                    Great teams start with great people.
                  </Title>

                  <Text>
                    Your team has {activeCount} active employees across{" "}
                    {departmentsCount} departments.
                  </Text>
                </div>

                <div className="banner-decoration">
                  <TeamOutlined />
                </div>
              </div>
            )}

            {isError && (
              <Alert
                type="error"
                showIcon
                message="Could not load employees"
                description="Confirm JSON Server is running on port 3001."
                action={
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                }
                style={{ marginBottom: 24 }}
              />
            )}

            {activePage === "overview" && (
              <>
                <Row gutter={[16, 16]} className="stats-row">
                  <Col xs={24} sm={12} xl={6}>
                    <Card className="stat-card">
                      <div className="stat-top">
                        <span>Total employees</span>
                        <span className="stat-icon purple">
                          <TeamOutlined />
                        </span>
                      </div>

                      {isLoading ? (
                        <Skeleton active paragraph={false} />
                      ) : (
                        <Statistic value={employees.length} />
                      )}

                      <Text type="secondary">
                        Across the organization
                      </Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} xl={6}>
                    <Card className="stat-card">
                      <div className="stat-top">
                        <span>Active workforce</span>
                        <span className="stat-icon green">
                          <CheckCircleOutlined />
                        </span>
                      </div>

                      <Statistic
                        value={activeCount}
                        suffix={`/ ${employees.length}`}
                      />

                      <Progress
                        percent={activePercentage}
                        showInfo={false}
                        strokeColor="#24b47e"
                      />

                      <Text type="secondary">
                        {activePercentage}% of employees active
                      </Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} xl={6}>
                    <Card className="stat-card">
                      <div className="stat-top">
                        <span>Departments</span>
                        <span className="stat-icon orange">
                          <UserOutlined />
                        </span>
                      </div>

                      <Statistic value={departmentsCount} />

                      <Text type="secondary">Teams represented</Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} xl={6}>
                    <Card className="stat-card">
                      <div className="stat-top">
                        <span>Monthly payroll</span>
                        <span className="stat-icon blue">
                          <WalletOutlined />
                        </span>
                      </div>

                      <Statistic
                        value={totalPayroll}
                        prefix="₹"
                        formatter={(value) =>
                          Number(value).toLocaleString("en-IN")
                        }
                      />

                      <Text type="secondary">
                        Active employees only
                      </Text>
                    </Card>
                  </Col>
                </Row>

                <Card className="analytics-panel">
                  <div className="panel-heading">
                    <div>
                      <Title level={4}>
                        Department distribution
                      </Title>
                      <Text type="secondary">
                        Select a department to view its employees.
                      </Text>
                    </div>

                    <Tag color="purple">
                      {departmentsCount} departments
                    </Tag>
                  </div>

                  <div className="department-bars">
                    {departmentStats.map((department) => {
                      const percentage = employees.length
                        ? Math.round(
                            (department.count / employees.length) * 100
                          )
                        : 0;

                      return (
                        <button
                          type="button"
                          className="department-bar-row"
                          key={department.name}
                          onClick={() => {
                            setDepartmentFilter(department.name);
                            setActivePage("departments");
                            setSearch("");
                            setStatusFilter("All");
                            setSelectedIds([]);
                          }}
                        >
                          <div className="bar-label">
                            <Text strong>{department.name}</Text>
                            <Text type="secondary">
                              {department.count} employee(s)
                            </Text>
                          </div>

                          <Progress
                            percent={percentage}
                            showInfo={false}
                            strokeColor="#6658e8"
                            trailColor="#efeff7"
                          />
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </>
            )}

            {activePage === "departments" && (
              <Row gutter={[16, 16]} className="department-grid">
                {departmentStats.map((department) => (
                  <Col xs={24} sm={12} xl={8} key={department.name}>
                    <Card
                      hoverable
                      className={`department-card ${
                        departmentFilter === department.name
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setDepartmentFilter(
                          departmentFilter === department.name
                            ? "All"
                            : department.name
                        );
                      }}
                    >
                      <div className="department-card-top">
                        <Avatar
                          shape="square"
                          icon={<TeamOutlined />}
                        />

                        <Tag color="purple">
                          {department.count} employees
                        </Tag>
                      </div>

                      <Title level={4}>{department.name}</Title>

                      <Text type="secondary">
                        {department.active} active ·{" "}
                        {department.count - department.active} inactive
                      </Text>

                      <Progress
                        percent={
                          department.count
                            ? Math.round(
                                (department.active / department.count) * 100
                              )
                            : 0
                        }
                        showInfo={false}
                        strokeColor="#24b47e"
                      />

                      <div className="department-card-action">
                        {departmentFilter === department.name
                          ? "Selected · Click to clear"
                          : "Click to filter employees"}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            <Card className="employee-panel">
              <div className="panel-heading">
                <div>
                  <Title level={4}>
                    {activePage === "departments"
                      ? departmentFilter === "All"
                        ? "Department employees"
                        : `${departmentFilter} employees`
                      : activePage === "employees"
                        ? "All employees"
                        : "Employee directory"}
                  </Title>

                  <Text type="secondary">
                    Search, filter, select, and manage employee records.
                  </Text>
                </div>

                <Text type="secondary">
                  {filteredEmployees.length} result(s)
                </Text>
              </div>

              <div className="table-toolbar">
                <Input
                  size="large"
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="Search name, email, role, location..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="employee-search"
                />

                <Select
                  size="large"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="status-select"
                  options={[
                    { label: "All statuses", value: "All" },
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />

                <Select
                  size="large"
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  className="department-select"
                  options={[
                    { label: "All departments", value: "All" },
                    ...departmentNames.map((department) => ({
                      label: department,
                      value: department,
                    })),
                  ]}
                />

                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                  loading={isFetching}
                >
                  Refresh
                </Button>

                <Button size="large" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              {selectedIds.length > 0 && (
                <div className="bulk-toolbar">
                  <Text strong>
                    {selectedIds.length} employee(s) selected
                  </Text>

                  <Space wrap>
                    <Button onClick={() => setSelectedIds([])}>
                      Clear selection
                    </Button>

                    <Popconfirm
                      title="Delete selected employees?"
                      description={`Delete ${selectedIds.length} selected record(s)?`}
                      okText="Delete all"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                      onConfirm={handleBulkDelete}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        loading={isDeleting}
                      >
                        Delete selected
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              )}

              {isLoading ? (
                <div className="loading-state">
                  <Skeleton active />
                </div>
              ) : (
                <EmployeeTable
                  employees={filteredEmployees}
                  loading={isFetching}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onView={setViewEmployee}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              )}

              {!isLoading && !isError && employees.length === 0 && (
                <div className="empty-action">
                  <Empty description="Your employee directory is empty">
                    <Button type="primary" onClick={openAddModal}>
                      Add your first employee
                    </Button>
                  </Empty>
                </div>
              )}
            </Card>

            <div className="page-footer">
              <Text type="secondary">
                Northstar Workspace · Employee operations
              </Text>
              <Text type="secondary">
                React · Redux Toolkit · RTK Query · Ant Design
              </Text>
            </div>
          </Content>
        </Layout>
      </Layout>

      <EmployeeFormModal
        open={modalOpen}
        employee={selectedEmployee}
        saving={isAdding || isUpdating}
        onCancel={closeModal}
        onSave={handleSave}
      />

      <Drawer
        title="Employee profile"
        open={Boolean(viewEmployee)}
        onClose={() => setViewEmployee(null)}
        width={420}
      >
        {viewEmployee && (
          <div className="employee-profile-drawer">
            <div className="drawer-profile-heading">
              <Avatar size={76} icon={<UserOutlined />} />

              <Title level={4}>{viewEmployee.name}</Title>

              <Text type="secondary">{viewEmployee.role}</Text>

              <Tag
                color={
                  viewEmployee.status === "Active" ? "success" : "default"
                }
              >
                {viewEmployee.status}
              </Tag>
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Employee ID">
                EMP-{String(viewEmployee.id).padStart(4, "0")}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {viewEmployee.email}
              </Descriptions.Item>

              <Descriptions.Item label="Department">
                {viewEmployee.department}
              </Descriptions.Item>

              <Descriptions.Item label="Location">
                {viewEmployee.location}
              </Descriptions.Item>

              <Descriptions.Item label="Monthly salary">
                ₹{viewEmployee.salary.toLocaleString("en-IN")}
              </Descriptions.Item>

              <Descriptions.Item label="Annual salary">
                ₹{(viewEmployee.salary * 12).toLocaleString("en-IN")}
              </Descriptions.Item>
            </Descriptions>

            <Space className="drawer-actions">
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => {
                  openEditModal(viewEmployee);
                  setViewEmployee(null);
                }}
              >
                Edit profile
              </Button>

              <Button onClick={() => setViewEmployee(null)}>
                Close
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </>
  );
}
