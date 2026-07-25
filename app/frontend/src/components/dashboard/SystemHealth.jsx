import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  LinearProgress,
  Chip,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import DnsIcon from "@mui/icons-material/Dns";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import SpeedIcon from "@mui/icons-material/Speed";

const healthData = [
  {
    title: "CPU Usage",
    value: 42,
    icon: <SpeedIcon color="primary" />,
    color: "primary",
  },
  {
    title: "Memory",
    value: 68,
    icon: <MemoryIcon color="success" />,
    color: "success",
  },
  {
    title: "Disk Usage",
    value: 55,
    icon: <StorageIcon color="warning" />,
    color: "warning",
  },
  {
    title: "Network",
    value: 81,
    icon: <DnsIcon color="secondary" />,
    color: "secondary",
  },
];

const SystemHealth = () => {
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
          System Health
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>

          {healthData.map((item) => (
            <Box key={item.title}>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {item.icon}

                  <Typography
                    fontWeight={600}
                  >
                    {item.title}
                  </Typography>

                </Stack>

                <Typography
                  fontWeight={700}
                >
                  {item.value}%
                </Typography>

              </Stack>

              <LinearProgress
                variant="determinate"
                value={item.value}
                color={item.color}
                sx={{
                  height: 8,
                  borderRadius: 5,
                }}
              />

            </Box>
          ))}

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography>Kubernetes</Typography>

            <Chip
              icon={<CheckCircleIcon />}
              label="Running"
              color="success"
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography>Docker</Typography>

            <Chip
              icon={<CloudDoneIcon />}
              label="Healthy"
              color="success"
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography>PostgreSQL</Typography>

            <Chip
              icon={<CheckCircleIcon />}
              label="Connected"
              color="primary"
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography>Backend API</Typography>

            <Chip
              icon={<CheckCircleIcon />}
              label="Online"
              color="success"
              size="small"
            />
          </Stack>

        </Stack>

      </CardContent>
    </Card>
  );
};

export default SystemHealth;
