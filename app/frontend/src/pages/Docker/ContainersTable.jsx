import {
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  LinearProgress,
} from "@mui/material";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

const containers = [
  {
    id: 1,
    name: "nginx",
    image: "nginx:latest",
    status: "Running",
    cpu: 18,
    memory: 42,
    uptime: "2d 5h",
  },
  {
    id: 2,
    name: "postgres",
    image: "postgres:16",
    status: "Running",
    cpu: 32,
    memory: 68,
    uptime: "7d 12h",
  },
  {
    id: 3,
    name: "redis",
    image: "redis:7",
    status: "Stopped",
    cpu: 0,
    memory: 0,
    uptime: "--",
  },
  {
    id: 4,
    name: "jenkins",
    image: "jenkins:lts",
    status: "Restarting",
    cpu: 8,
    memory: 25,
    uptime: "15m",
  },
];

const statusColor = {
  Running: "success",
  Stopped: "error",
  Restarting: "warning",
};

export default function ContainersTable() {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>CPU</TableCell>
            <TableCell>Memory</TableCell>
            <TableCell>Uptime</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {containers.map((container) => (
            <TableRow hover key={container.id}>
              <TableCell>{container.name}</TableCell>

              <TableCell>{container.image}</TableCell>

              <TableCell>
                <Chip
                  label={container.status}
                  color={statusColor[container.status]}
                  size="small"
                />
              </TableCell>

              <TableCell sx={{ minWidth: 120 }}>
                <LinearProgress
                  variant="determinate"
                  value={container.cpu}
                  sx={{ mb: 0.5 }}
                />
                {container.cpu}%
              </TableCell>

              <TableCell sx={{ minWidth: 120 }}>
                <LinearProgress
                  variant="determinate"
                  value={container.memory}
                  sx={{ mb: 0.5 }}
                />
                {container.memory}%
              </TableCell>

              <TableCell>{container.uptime}</TableCell>

              <TableCell align="center">
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                >
                  <Tooltip title="Start">
                    <IconButton color="success">
                      <PlayArrowOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Stop">
                    <IconButton color="error">
                      <StopOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Restart">
                    <IconButton color="warning">
                      <RestartAltOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Logs">
                    <IconButton color="primary">
                      <ArticleOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
