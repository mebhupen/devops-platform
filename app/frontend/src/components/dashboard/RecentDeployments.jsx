import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const deployments = [
  {
    name: "frontend",
    namespace: "enterprise-devops",
    replicas: "3/3",
    image: "frontend:v2.1",
    status: "Running",
    updated: "2 mins ago",
  },
  {
    name: "backend",
    namespace: "enterprise-devops",
    replicas: "2/2",
    image: "backend:v1.9",
    status: "Running",
    updated: "8 mins ago",
  },
  {
    name: "postgres",
    namespace: "database",
    replicas: "1/1",
    image: "postgres:16",
    status: "Healthy",
    updated: "12 mins ago",
  },
  {
    name: "prometheus",
    namespace: "monitoring",
    replicas: "1/1",
    image: "prometheus:v3",
    status: "Running",
    updated: "20 mins ago",
  },
  {
    name: "grafana",
    namespace: "monitoring",
    replicas: "1/1",
    image: "grafana:v12",
    status: "Running",
    updated: "25 mins ago",
  },
];

const statusColor = (status) => {
  switch (status) {
    case "Running":
      return "success";
    case "Healthy":
      return "primary";
    case "Pending":
      return "warning";
    case "Failed":
      return "error";
    default:
      return "default";
  }
};

const RecentDeployments = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <CloudUploadIcon color="primary" />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Recent Deployments
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Table size="small">

          <TableHead>

            <TableRow>

              <TableCell>Name</TableCell>

              <TableCell>Namespace</TableCell>

              <TableCell>Replicas</TableCell>

              <TableCell>Image</TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Updated</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {deployments.map((item) => (

              <TableRow
                hover
                key={item.name}
              >

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "#2563EB",
                        fontSize: 14,
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>

                    {item.name}

                  </Stack>

                </TableCell>

                <TableCell>
                  {item.namespace}
                </TableCell>

                <TableCell>
                  {item.replicas}
                </TableCell>

                <TableCell>
                  {item.image}
                </TableCell>

                <TableCell>

                  <Chip
                    label={item.status}
                    color={statusColor(item.status)}
                    size="small"
                  />

                </TableCell>

                <TableCell>
                  {item.updated}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </CardContent>
    </Card>
  );
};

export default RecentDeployments;
