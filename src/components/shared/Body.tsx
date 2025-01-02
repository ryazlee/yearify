import { Box } from "@mui/material";

export const Body = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            textAlign: "center",
            paddingTop: "1rem",
        }}
    >
        {children}
    </Box>
);
