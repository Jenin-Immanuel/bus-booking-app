console.log(import.meta.env.VITE_API_URL);

export const API_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:5556";
