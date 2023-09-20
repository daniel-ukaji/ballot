// pages/_app.js
import { AuthProvider } from '@/services/AuthContext';
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"



function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
      <Component {...pageProps} />
      </ThemeProvider>
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
