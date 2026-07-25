import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";

const stats = [
  {
    title: "Running Containers",
    value: 12,
    usage: 80,
    color: "#16a34a",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    title: "Docker Images",
    value: 46,
    usage: 60,
    color: "#2563eb",
    icon: <ImageOutlinedIcon />,
  },
  {
    title: "Volumes",
    value: 18,
    usage: 45,
    color: "#f59e0b",
    icon: <StorageOutlinedIcon />,
  },
  {
    title: "Networks",
    value: 6,
    usage: 30,
    color: "#7c3aed",
    icon: <LanOutlinedIcon />,
  },
];

export default function DockerStats() {
  return (
    <Grid container spacing={3}>
      {stats.map((item) => (
        <Grid
          key={item.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {item.value}
                  </Typography>
                </Stack>

                <Avatar
                  sx={{
                    bgcolor: item.color,
                    width: 54,
                    height: 54,
                  }}
                >
                  {item.icon}
                </Avatar>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={item.usage}
                sx={{
                  height: 8,
                  borderRadius: 8,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: "block",
                }}
              >
                {item.usage}% Utilized
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
