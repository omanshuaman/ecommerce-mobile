import { Slot } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "PPFormulaCondensed-Light": require("../assets/fonts/PPFormulaCondensed-Light.ttf"),
    "PPFormulaCondensed-Regular": require("../assets/fonts/PPFormulaCondensed-Regular.ttf"),
    "PPFormulaCondensed-Bold": require("../assets/fonts/PPFormulaCondensed-Bold.ttf"),
    "PPFormulaCondensed-Black": require("../assets/fonts/PPFormulaCondensed-Black.ttf"),
    "Helvetica-Neue": require("../assets/fonts/HelveticaNeue.ttf"),
    "HelveticaNeue-Bold": require("../assets/fonts/HelveticaNeuBold.ttf"),
    "HelveticaNeue-BlackCond": require("../assets/fonts/HelveticaNeue BlackCond.ttf"),
    "HelveticaNeue-Light": require("../assets/fonts/HelveticaNeue Light.ttf"),
    "HelveticaNeue-Medium": require("../assets/fonts/HelveticaNeue Medium.ttf"),
    "HelveticaNeue-Thin": require("../assets/fonts/HelveticaNeue Thin.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <StatusBar />
          <Slot />
        </GluestackUIProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
