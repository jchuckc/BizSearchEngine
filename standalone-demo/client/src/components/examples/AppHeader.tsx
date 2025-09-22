import { AppHeader } from "../AppHeader";
import { ThemeProvider } from "../theme-provider";

export default function AppHeaderExample() {
  return (
    <ThemeProvider>
      <AppHeader
        onSearch={(query) => console.log(`Header search: ${query}`)}
        onShowProfile={() => console.log("Show profile")}
        onShowSettings={() => console.log("Show settings")}
        onToggleMobileMenu={() => console.log("Toggle mobile menu")}
      />
    </ThemeProvider>
  );
}