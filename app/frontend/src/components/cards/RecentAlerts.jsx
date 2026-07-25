import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

function RecentAlerts() {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Alerts
        </Typography>

        <Stack spacing={2}>
          <Chip
            label="CPU usage above 80%"
            color="warning"
          />

          <Chip
            label="Node Healthy"
            color="success"
          />

          <Chip
            label="All Pods Running"
            color="success"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RecentAlerts;
