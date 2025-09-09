import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chit-chat-realtime-chat-app-2.onrender.com";

export const useStoreAuth = create((set, get) => ({
  isTailoring: false,
  tailorData: null,

  getTailorData: async (data) => {
    try {
        set({ isTailoring: true })
      const res = await axiosInstance.post("/resume/tailor-info", data);
      set({ tailorData: res.data, isTailoring: false });
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      set({ isTailoring: false });
    }
  },
}));
