import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`, // Your API base URL
  withCredentials: true, // Ensures session cookies are sent
});

export default axiosInstance;
