import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { UserGuideModal } from "../userGuide/UserGuideModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export const Header = () => {
    const [showUserGuide, setShowUserGuide] = useState(false);

    const [path, setPath] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            setPath(currentPath);
        }
    }, []);

    const getTitle = () => {
        // use path to convert value into capital version of the page without the /
        return path?.replace(/^\/(.*)/, (_, p1) => p1)  // Remove leading slash
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
            .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
            || "DEFAULT";  // Default to "Home" if path is empty
    };

    return (
        <>
            {showUserGuide && (
                <UserGuideModal
                    isOpen={showUserGuide}
                    onModalClose={() => setShowUserGuide(false)}
                />
            )}
            <Box
                component="header"
                sx={{
                    alignItems: "center",
                    textAlign: "center",
                    paddingTop: "1rem",
                }}
            >
                <Typography variant="h4">✨ {getTitle()} ✨</Typography>
                <Box
                    sx={{
                        position: "absolute",
                        right: "1em",
                        top: "1em",
                    }}
                >
                    <IconButton size="small" onClick={() => setShowUserGuide(true)}>
                        <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box >
        </>
    );
};