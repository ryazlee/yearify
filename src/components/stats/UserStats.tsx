import { Typography, Box, Paper, Grid2 as Grid } from "@mui/material";
import { CategorizedEvents } from "../types";
import { getMostEventfulDay, getStats } from "./utils";

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <Paper
        elevation={3}
        sx={{
            padding: 1,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
        }}
    >
        <Typography sx={{ fontSize: "10px" }} color="textSecondary" gutterBottom>
            {title.charAt(0).toUpperCase() + title.slice(1)}
        </Typography>
        <Typography sx={{ fontSize: "9px" }} color="primary">
            {value}
        </Typography>
    </Paper>
);

const UserStats = ({ categorizedEvents }: { categorizedEvents: CategorizedEvents | null }) => {
    if (!categorizedEvents || Object.keys(categorizedEvents).length === 0) {
        return (
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    No data available to display user statistics.
                </Typography>
            </Box>
        );
    }

    const stats = getStats(categorizedEvents);
    const mostEventfulDay = getMostEventfulDay(categorizedEvents);

    const viewableStats = Object.entries(stats).filter(stat => stat[0] !== "uncategorized");

    return (
        <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>
                Your Year in Numbers
            </Typography>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}>
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                    {viewableStats.map(([key, value]) => (
                        <Grid key={key}>
                            <StatCard title={key.replace(/_/g, " ")} value={value} />
                        </Grid>
                    ))}
                    <Grid>
                        <StatCard
                            title="Most Eventful Day"
                            value={mostEventfulDay?.date
                                ? `${mostEventfulDay.date} (${mostEventfulDay.events.length} events)`
                                : "N/A"}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default UserStats;
