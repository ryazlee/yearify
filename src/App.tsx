import "./components/styles/App.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Main from "./components/Main";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="Main">
        <Main />
      </div>
    </ThemeProvider>
  );
}
