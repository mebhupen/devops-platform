import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Avatar,
  Box,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const alerts = [
  {
    title: "High CPU Usage",
    severity: "Critical",
    source: "backend-pod",
    time: "2 min ago",
    color: "error",
    icon: <ErrorOutlinedIcon />,
  },
  {
    title: "Memory Threshold",
    severity: "Warning",
    source: "worker-node-1",
    time: "10 min ago",
    color: "warning",
    icon: <WarningAmberIcon />,
  },
  {
    title: "Deployment Successful",
    severity: "Info",
    source: "frontend",
    time: "20 min ago",
    color: "primary",
    icon: <CheckCircleIcon />,
  },
  {
    title: "Grafana Connected",
    severity: "Healthy",
    source: "monitoring",
    time: "35 min ago",
    color: "success",
    icon: <NotificationsActiveIcon />,
  },
];

const RecentAlerts = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Recent Alerts
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>

          {alerts.map((alert) => (

            <Box
              key={alert.title}
              sx={{
                p: 2,
                border: "1px solid #E5E7EB",
                borderRadius: 2,
                transition: ".3s",

                "&:hover": {
                  boxShadow: "0 8px 18px rgba(0,0,0,.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <Avatar
                  sx={{
                    bgcolor: `${alert.color}.main`,
                  }}
                >
                  {alert.icon}
                </Avatar>

                <Box flex={1}>

                  <Typography
                    fontWeight={700}
                  >
                    {alert.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {alert.source}
                  </Typography>

                </Box>

                <Chip
                  label={alert.severity}
                  color={alert.color}
                  size="small"
                />

              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                mt={1}
                display="block"
              >
                {alert.time}
              </Typography>

            </Box>

          ))}

        </Stack>

      </CardContent>
    </Card>
  );
};

export default RecentAlerts;
