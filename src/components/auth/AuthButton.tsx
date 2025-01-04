import { Button } from '@mui/material';
import { api } from '../../api';

interface AuthButtonProps {
    isAuthenticated: boolean;
    callback: () => void;
}

export const AuthButton = ({ isAuthenticated, callback }: AuthButtonProps) => {
    const handleAuthClick = () => {
        api.handleAuthClick(isAuthenticated ? "sign-out" : "sign-in", callback);
    };

    return (
        <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleAuthClick}
        >
            {isAuthenticated ? "Disconnect from Google Calendar" : "Connect to Google Calendar"}
        </Button>
    );
};
