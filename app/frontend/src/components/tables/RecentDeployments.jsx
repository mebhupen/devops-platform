import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const rows = [
  {
    service: "Backend API",
    version: "v1.2.0",
    status: "Running",
  },
  {
    service: "Frontend",
    version: "v1.1.4",
    status: "Running",
  },
  {
    service: "Prometheus",
    version: "v2.54",
    status: "Running",
  },
];

function RecentDeployments() {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Deployments
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.service}>
                <TableCell>{row.service}</TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color="success"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default RecentDeployments;
