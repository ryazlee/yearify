import { Box } from "@mui/material";

export const Page = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            paddingBottom: "1rem",
        }}
    >
        {children}
    </Box>
);
