import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { Router } from "./components/Router";
import { BrowserRouter } from "react-router"
import { CyclesContextProvider } from "./contexts/CycleContext";

export function App() {
  return (

    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>

      <GlobalStyle />

    </ThemeProvider>
  )
}

