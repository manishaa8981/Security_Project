// src/App.tsx
import { Toaster } from "@/components/shadcn/sonner";
import { ThemeProvider } from "./components/common/theme-provider";
import Router from "./Router";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
