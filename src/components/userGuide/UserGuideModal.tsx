import React from "react";
import { Modal, Box, Button, Typography, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Tutorial = () => (
    <List style={{ margin: "0" }}>
        <ListItem>
            <ListItemText primary="1. Click on the 'Sign in with Google' button to sign in with your Google account." />
        </ListItem>
        <ListItem>
            <ListItemText primary="2. After signing in, you will be redirected back to the app where you will see a categorized list of events." />
        </ListItem>
        <ListItem>
            <ListItemText primary="3. You can categorize the events by dragging and dropping them into the respective categories or clicking on the 'Categorize' button to open a dialog to iteratively categorize the events." />
        </ListItem>
        <Box marginTop="16px">
            <img
                src={`${process.env.PUBLIC_URL}/media/userGuide/user-guide-dnd.gif`}
                alt="Drag and Drop Guide"
                style={{ width: "100%", borderRadius: "8px" }}
            />
            <img
                src={`${process.env.PUBLIC_URL}/media/userGuide/user-guide-modal.gif`}
                alt="User Guide Modal"
                style={{ width: "100%", borderRadius: "8px", marginTop: "16px" }}
            />
        </Box>
        <ListItem>
            <ListItemText primary="4. After categorizing the events, you can optionally click on the 'Show Stats' button to view the statistics of the categorized events." />
        </ListItem>
        <ListItem>
            <ListItemText primary="5. Click on the 'Download' button to download the categorized events as a PNG image. Note: If you are using Chrome on mobile, you may need to click the 'Open in new tab' button to view and save the image." />
        </ListItem>
        <ListItem>
            <ListItemText primary="6. Please share the image on social media! A great place to start would be on your story on Instagram or Facebook." />
        </ListItem>
    </List>
);

const UserGuide = () => (
    <>
        <Typography variant="h6" gutterBottom>
            User Guide
        </Typography>
        <Tutorial />
    </>
);

export const UserGuideModal = ({
    isOpen,
    onModalClose,
}: {
    isOpen: boolean;
    onModalClose: () => void;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        bgcolor: "background.paper",
        border: "1px solid #ddd",
        boxShadow: 24,
        p: 3,
        borderRadius: "8px",
    };

    return (
        <Modal open={isOpen} onClose={onModalClose}>
            <Box sx={style}>
                <UserGuide />
                <Box display="flex" justifyContent="flex-end" marginTop="16px">
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onModalClose}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
