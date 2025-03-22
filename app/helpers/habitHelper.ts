export const getStatusBgColor = (status: string, isDark: boolean) => {
  if (isDark) {
    switch (status?.toLowerCase() ?? "") {
      case "active":
        return "rgba(99, 102, 241, 0.2)"
      case "completed":
        return "rgba(34, 197, 94, 0.2)"
      case "failed":
        return "rgba(239, 68, 68, 0.2)"
      default:
        return "rgba(107, 114, 128, 0.2)"
    }
  }
  switch (status.toLowerCase()) {
    case "active":
      return "#e2e8ff"
    case "completed":
      return "#dcfce7"
    case "failed":
      return "#fee2e2"
    default:
      return "#f3f4f6"
  }
}

export const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "#6366f1"
    case "completed":
      return "#22c55e"
    case "failed":
      return "#ef4444"
    default:
      return "#6b7280"
  }
}


export   const getFrequencyText = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "daily":
        return "Day"
      case "weekly":
        return "Week"
      case "monthly":
        return "Month"
      default:
        return "Period"
    }
  }
  
