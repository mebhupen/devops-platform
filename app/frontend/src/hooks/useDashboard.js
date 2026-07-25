import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";

export default function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDashboard();

      // API returns { success, data }
      setDashboard(response.data);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const timer = setInterval(fetchDashboard, 30000);

    return () => clearInterval(timer);
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
