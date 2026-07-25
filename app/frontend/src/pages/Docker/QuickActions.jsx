import {
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import StopOutlinedIcon from "@mui/icons-material/StopOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";

const actions = [
  {
    label: "Start Container",
    icon: <PlayArrowOutlinedIcon />,
    color: "success",
  },
  {
    label: "Stop Container",
    icon: <StopOutlinedIcon />,
    color: "error",
  },
  {
    label: "Restart Container",
    icon: <RestartAltOutlinedIcon />,
    color: "warning",
  },
  {
    label: "Pull Latest Image",
    icon: <CloudDownloadOutlinedIcon />,
    color: "primary",
  },
  {
    label: "Remove Container",
    icon: <DeleteOutlineOutlinedIcon />,
    color: "secondary",
  },
  {
    label: "Docker System Prune",
    icon: <CleaningServicesOutlinedIcon />,
    color: "info",
  },
];

export default function QuickActions() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Quick Actions
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="contained"
            color={action.color}
            startIcon={action.icon}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              py: 1.2,
              borderRadius: 2,
            }}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}
