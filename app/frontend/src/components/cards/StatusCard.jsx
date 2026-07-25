import { Card, CardContent, Typography, Stack } from "@mui/material";

function StatusCard() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Cluster Status
        </Typography>

        <Stack spacing={2} mt={2}>
          <Typography>🟢 Kubernetes Healthy</Typography>
          <Typography>🟢 Docker Running</Typography>
          <Typography>🟢 Prometheus Active</Typography>
          <Typography>🟢 Grafana Active</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatusCard;
