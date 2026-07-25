import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Divider,
} from "@mui/material";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

const events = [
  {
    id: 1,
    title: "Container Started",
    description: "nginx container started successfully",
    time: "2 minutes ago",
    type: "Running",
    color: "success",
    icon: <PlayArrowOutlinedIcon />,
  },
  {
    id: 2,
    title: "Container Restarted",
    description: "jenkins restarted after configuration update",
    time: "12 minutes ago",
    type: "Restart",
    color: "warning",
    icon: <RestartAltOutlinedIcon />,
  },
  {
    id: 3,
    title: "Image Pulled",
    description: "postgres:16 image downloaded",
    time: "38 minutes ago",
    type: "Image",
    color: "primary",
    icon: <CloudDownloadOutlinedIcon />,
  },
  {
    id: 4,
    title: "Container Stopped",
    description: "redis container stopped",
    time: "1 hour ago",
    type: "Stopped",
    color: "error",
    icon: <StopOutlinedIcon />,
  },
];

export default function DockerEvents() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Recent Docker Events
      </Typography>

      <List disablePadding>
        {events.map((event, index) => (
          <div key={event.id}>
            <ListItem
              disableGutters
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: `${event.color}.main`,
                  }}
                >
                  {event.icon}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    spacing={1}
                  >
                    <Typography
                      fontWeight={600}
                    >
                      {event.title}
                    </Typography>

                    <Chip
                      label={event.type}
                      color={event.color}
                      size="small"
                    />
                  </Stack>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {event.description}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {event.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>

            {index !== events.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </div>
        ))}
      </List>
    </Paper>
  );
}
