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
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";

const tasks = [
  {
    id: "TASK-101",
    title: "Deploy Backend API",
    assignee: "Bhupendra",
    priority: "High",
    status: "In Progress",
    progress: 75,
    due: "Today",
  },
  {
    id: "TASK-102",
    title: "Configure Prometheus",
    assignee: "Rahul",
    priority: "Medium",
    status: "Completed",
    progress: 100,
    due: "Tomorrow",
  },
  {
    id: "TASK-103",
    title: "Kubernetes Monitoring",
    assignee: "Ankit",
    priority: "High",
    status: "Pending",
    progress: 30,
    due: "2 Days",
  },
  {
    id: "TASK-104",
    title: "Docker Image Cleanup",
    assignee: "Sahil",
    priority: "Low",
    status: "Completed",
    progress: 100,
    due: "Friday",
  },
  {
    id: "TASK-105",
    title: "CI/CD Pipeline",
    assignee: "Aman",
    priority: "Critical",
    status: "In Progress",
    progress: 60,
    due: "Next Week",
  },
];

const priorityColor = (priority) => {
  switch (priority) {
    case "Critical":
      return "error";
    case "High":
      return "warning";
    case "Medium":
      return "primary";
    default:
      return "success";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "warning";
    case "In Progress":
      return "primary";
    default:
      return "default";
  }
};

const RecentTasks = () => {
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
          Recent Tasks
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Table size="small">

          <TableHead>

            <TableRow>

              <TableCell>ID</TableCell>

              <TableCell>Task</TableCell>

              <TableCell>Engineer</TableCell>

              <TableCell>Priority</TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Progress</TableCell>

              <TableCell>Due</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {tasks.map((task) => (

              <TableRow
                hover
                key={task.id}
              >

                <TableCell>
                  {task.id}
                </TableCell>

                <TableCell>
                  {task.title}
                </TableCell>

                <TableCell>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >

                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#2563EB",
                        fontSize: 14,
                      }}
                    >
                      {task.assignee.charAt(0)}
                    </Avatar>

                    {task.assignee}

                  </Stack>

                </TableCell>

                <TableCell>

                  <Chip
                    label={task.priority}
                    color={priorityColor(task.priority)}
                    size="small"
                  />

                </TableCell>

                <TableCell>

                  <Chip
                    label={task.status}
                    color={statusColor(task.status)}
                    size="small"
                  />

                </TableCell>

                <TableCell
                  width={180}
                >

                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mb: .5,
                    }}
                  />

                  <Typography
                    variant="caption"
                  >
                    {task.progress}%
                  </Typography>

                </TableCell>

                <TableCell>
                  {task.due}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </CardContent>
    </Card>
  );
};

export default RecentTasks;
