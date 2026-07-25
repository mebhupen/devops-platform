import { Typography, Box } from "@mui/material";

function NotFound() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h2">
                404 - Page Not Found
            </Typography>
        </Box>
    );
}

export default NotFound;
