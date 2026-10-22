import styled from "@emotion/styled";

type BadgeStatus = "success" | "warning" | "error";

type EmotionBadgeProps = {
  status: BadgeStatus;
};

const Badge = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<EmotionBadgeProps>(({ status }) => {
  const palette = {
    success: {
      background: "#dcfce7",
      color: "#166534",
    },
    warning: {
      background: "#fef3c7",
      color: "#92400e",
    },
    error: {
      background: "#fee2e2",
      color: "#991b1b",
    },
  }[status];

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 11px",
    borderRadius: "999px",
    backgroundColor: palette.background,
    color: palette.color,
    fontSize: "13px",
    fontWeight: 700,
  };
});

export default function EmotionBadge({
  status,
}: EmotionBadgeProps) {
  const labels: Record<BadgeStatus, string> = {
    success: "All checks passed",
    warning: "Needs attention",
    error: "Action required",
  };

  return <Badge status={status}>{labels[status]}</Badge>;
}