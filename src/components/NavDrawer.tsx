import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

export const NavDrawer = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => {
        setOpen(open);
    };

    return (
        <>
            {/* Hamburger Button */}
            <IconButton
                onClick={() => toggleDrawer(true)}
                size="small"
                sx={{
                    position: "fixed",
                    left: "1em",
                    top: "1em",
                    zIndex: 1000,
                }}
            >
                <MenuIcon fontSize="small" />
            </IconButton>

            <Drawer
                anchor="left"
                open={open}
                onClose={() => toggleDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: "200px", // More compact
                        backgroundColor: "#fff", // Simplified background
                        paddingTop: "1rem",
                        paddingLeft: "1rem",
                    },
                }}
            >
                <Link href="/" passHref>
                    Home
                </Link>
                <Link href="/yearify" passHref>
                    Yearify
                </Link>
                <Link href="/monthify" passHref>
                    Monthify
                </Link>
                <Link href="/quarterify" passHref>
                    Quarterify
                </Link>
            </Drawer>
        </>
    );
};
