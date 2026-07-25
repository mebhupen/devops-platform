import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
  Box,
  Chip,
} from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DnsIcon from "@mui/icons-material/Dns";
import StorageIcon from "@mui/icons-material/Storage";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const activities = [
  {
    title: "GitHub Push",
    description: "Frontend changes pushed to main branch.",
    user: "Bhupendra",
    time: "2 mins ago",
    status: "Completed",
    color: "success",
    icon: <GitHubIcon />,
  },
  {
    title: "Jenkins Pipeline",
    description: "CI pipeline completed successfully.",
    user: "Jenkins",
    time: "8 mins ago",
    status: "Success",
    color: "primary",
    icon: <CloudUploadIcon />,
  },
  {
    title: "Kubernetes Deployment",
    description: "backend:v2.0 deployed successfully.",
    user: "Kubernetes",
    time: "15 mins ago",
    status: "Running",
    color: "success",
    icon: <DnsIcon />,
  },
  {
    title: "Docker Image",
    description: "Docker image pushed to Docker Hub.",
    user: "Docker",
    time: "30 mins ago",
    status: "Completed",
    color: "primary",
    icon: <StorageIcon />,
  },
  {
    title: "Prometheus Alert",
    description: "CPU usage exceeded 80%.",
    user: "Prometheus",
    time: "45 mins ago",
    status: "Warning",
    color: "warning",
    icon: <WarningAmberIcon />,
  },
  {
    title: "Grafana Health",
    description: "Monitoring dashboard is healthy.",
    user: "Grafana",
    time: "1 hour ago",
    status: "Healthy",
    color: "success",
    icon: <CheckCircleIcon />,
  },
];

const ActivityTimeline = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Activity Timeline
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>

          {activities.map((activity, index) => (

            <Stack
              key={index}
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >

              <Avatar
                sx={{
                  bgcolor: `${activity.color}.main`,
                }}
              >
                {activity.icon}
              </Avatar>

              <Box flex={1}>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Typography fontWeight={700}>
                    {activity.title}
                  </Typography>

                  <Chip
                    label={activity.status}
                    color={activity.color}
                    size="small"
                  />

                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                >
                  {activity.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  mt={1}
                  display="block"
                >
                  {activity.user} • {activity.time}
                </Typography>

              </Box>

            </Stack>

          ))}

        </Stack>

      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
