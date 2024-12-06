
import { Button } from '@mui/material';
import { api } from '../../api';

export const AuthButton = ({ isAuthenticated, callback }: { isAuthenticated: boolean, callback: () => void }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={(_) => api.handleAuthClick(isAuthenticated ? "sign-out" : "sign-in", callback)}
        >
            {isAuthenticated ? "Disconnect from Google Calendar" : "Connect to Google Calendar"}
        </Button>
    );
}