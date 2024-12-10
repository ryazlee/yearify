import { Typography } from "@mui/material";
import { Category, CategorizedEvents } from "../types";

const UserStats = ({ categorizedEvents }: { categorizedEvents: CategorizedEvents }) => {
    return (
        <>
            {Object.keys(categorizedEvents).filter(category => category !== 'uncategorized').map((category) => (
                <div key={category}>
                    <Typography sx={{ fontSize: 8 }}>
                        {category}: {categorizedEvents[category as Category].length}
                    </Typography>
                </div>
            ))}
        </>
    );
};

export default UserStats;
