import { Box, Link, Typography } from "@mui/material";

export const Footer = () => (
    <Box
        component="footer"
        sx={{
            textAlign: "center",
            paddingTop: "1rem",
        }}
    >
        <Link
            href={`/legal/privacy-policy.txt`}
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{
                fontSize: "0.75rem",
                marginRight: "1rem",
            }}
        >
            Privacy Policy
        </Link>
        <Link
            href={`/legal/terms-of-service.txt`}
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{
                fontSize: "0.75rem",
            }}
        >
            Terms of Service
        </Link>
        <Typography
            color="textSecondary"
            sx={{ fontSize: "0.75rem", fontStyle: "italic" }}
        >
            If you have any questions or concerns, please{" "}
            <Link href="mailto:ryan.j.lee99@gmail.com">email me</Link> or fill out the{" "}
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdPgeP1zRy7N_lK9NKIeoIz8FwEY9OWyllDHgd5Q0PUWz4R1g/viewform?usp=sharing">
                feedback form
            </Link>
        </Typography>
    </Box>
);
