import axios from "axios";

const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
        status: error.response?.status || 500,
      };
    }
    return {
      success: false,
      message: "Network error or server is unreachable",
      status: 500,
    };
  };

  export default handleApiError