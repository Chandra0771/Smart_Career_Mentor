import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Vite config for React + SWC
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});

