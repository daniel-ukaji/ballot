// pages/_app.js
import { AuthProvider } from '../services/AuthContext';
import '../styles/globals.css';
import { Toaster } from "../components/ui/toaster";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
