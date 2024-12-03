import { Box, Typography } from "@mui/material";
import { CATEGORY_COLORS } from "../types";

export const ColorLegend = () => {
    return (
        <Box display={'flex'} flexDirection={'row'} gap={"10px"} padding={"10px 0"} >
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={CATEGORY_COLORS.travel} />
                <Typography>Travel</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={CATEGORY_COLORS.social} />
                <Typography>Social</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={CATEGORY_COLORS.fitness} />
                <Typography>Fitness</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={CATEGORY_COLORS.personal} />
                <Typography>Personal</Typography>
            </Box>
        </Box >
    );
}