import { useEffect, useState } from "react";

import {
  getDashboard,
  getContainers,
  getEvents,
} from "../services/dockerService";

export default function useDocker() {
  const [dashboard, setDashboard] = useState(null);
  const [containers, setContainers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [dashboardData, containerData, eventData] =
        await Promise.all([
          getDashboard(),
          getContainers(),
          getEvents(),
        ]);

      setDashboard(dashboardData);
      setContainers(containerData);
      setEvents(eventData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    dashboard,
    containers,
    events,
    loading,
    refresh: loadData,
  };
}
