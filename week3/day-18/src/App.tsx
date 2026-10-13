
import { ConfigProvider, App as AntApp } from "antd";
import JobApplicationForm from "./components/JobApplicationForm";
import "./App.css";

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7055df",
          colorError: "#d9435f",
          borderRadius: 10,
          controlHeight: 44,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <AntApp>
        <JobApplicationForm />
      </AntApp>
    </ConfigProvider>
  );
}
