
import { api } from './api';

export const AuthButton = ({ isAuthenticated, callback }: { isAuthenticated: boolean, callback: () => void }) => {
    return (
        <button onClick={(_) => api.handleAuthClick(isAuthenticated ? "sign-out" : "sign-in", callback)}>
            {isAuthenticated ? "Sign Out" : "Sign In"}
        </button>
    );
}