import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Avatar,
  Divider,
  Box,
} from "@mui/material";

import DnsIcon from "@mui/icons-material/Dns";
import HubIcon from "@mui/icons-material/Hub";
import StorageIcon from "@mui/icons-material/Storage";
import AppsIcon from "@mui/icons-material/Apps";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const clusterStats = [
  {
    title: "Nodes",
    value: "3",
    icon: <DnsIcon />,
    color: "#2563EB",
  },
  {
    title: "Pods",
    value: "18",
    icon: <AppsIcon />,
    color: "#16A34A",
  },
  {
    title: "Deployments",
    value: "7",
    icon: <HubIcon />,
    color: "#EA580C",
  },
  {
    title: "Services",
    value: "12",
    icon: <StorageIcon />,
    color: "#9333EA",
  },
];

const ClusterStatus = () => {
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
          Cluster Status
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>

          {clusterStats.map((item) => (
            <Grid
              item
              xs={6}
              key={item.title}
            >
              <Box
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                }}
              >

                <Avatar
                  sx={{
                    bgcolor: item.color,
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {item.value}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.title}
                </Typography>

              </Box>
            </Grid>
          ))}

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography fontWeight={600}>
              API Server
            </Typography>

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
            <Typography fontWeight={600}>
              Scheduler
            </Typography>

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
            <Typography fontWeight={600}>
              Controller Manager
            </Typography>

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
            <Typography fontWeight={600}>
              CoreDNS
            </Typography>

            <Chip
              icon={<CheckCircleIcon />}
              label="Available"
              color="primary"
              size="small"
            />
          </Stack>

        </Stack>

      </CardContent>
    </Card>
  );
};

export default ClusterStatus;
