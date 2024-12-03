import { Box, Typography } from "@mui/material";
import { CATEGORY_COLORS } from "../types";

const COLORBOX_STYLE = {
    width: '25px',
    height: '25px',
    borderRadius: '4px',
};

const TEXT_STYLE = {
    fontSize: '15px',
    fontWeight: 'bold',
};

export const ColorLegend = () => {
    return (
        <Box display={'flex'} flexDirection={'row'} gap={"10px"} padding={"10px 0"}>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box style={COLORBOX_STYLE} bgcolor={CATEGORY_COLORS.travel} />
                <Typography style={TEXT_STYLE}>Travel</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box style={COLORBOX_STYLE} bgcolor={CATEGORY_COLORS.social} />
                <Typography style={TEXT_STYLE}>Social</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box style={COLORBOX_STYLE} bgcolor={CATEGORY_COLORS.fitness} />
                <Typography style={TEXT_STYLE}>Fitness</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box style={COLORBOX_STYLE} bgcolor={CATEGORY_COLORS.personal} />
                <Typography style={TEXT_STYLE}>Personal</Typography>
            </Box>
        </Box >
    );
}