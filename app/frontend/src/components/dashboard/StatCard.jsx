import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatCard = ({
  title,
  value,
  icon,
  color = "#2563EB",
  trend = "",
  status = "",
}) => {
  const positive =
    !trend.startsWith("-");

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        transition: "0.3s",
        height: "100%",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              mt={1}
            >
              {value}
            </Typography>

          </Box>

          <Avatar
            sx={{
              bgcolor: color,
              width: 58,
              height: 58,
            }}
          >
            {icon}
          </Avatar>

        </Stack>

        <Box mt={3}>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >

              {positive ? (
                <TrendingUpIcon
                  color="success"
                  fontSize="small"
                />
              ) : (
                <TrendingDownIcon
                  color="error"
                  fontSize="small"
                />
              )}

              <Typography
                fontWeight={600}
                color={
                  positive
                    ? "success.main"
                    : "error.main"
                }
              >
                {trend}
              </Typography>

            </Stack>

            <Chip
              label={status}
              size="small"
              color={
                status === "Healthy"
                  ? "success"
                  : status === "Running"
                  ? "primary"
                  : status === "Normal"
                  ? "warning"
                  : "error"
              }
            />

          </Stack>

        </Box>

      </CardContent>
    </Card>
  );
};

export default StatCard;
