import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async analyzeVideo(filePath: string) {
    // The current backend endpoint expects file_path as a query parameter or JSON body
    // Based on backend/app.py: async def analyze_video(file_path: str)
    // FastAPI by default treats simple types in the function signature as query parameters
    const response = await apiClient.post(`/api/analyze?file_path=${filePath}`);
    return response.data;
  },

  async getHealth() {
    const response = await apiClient.get("/health");
    return response.data;
  },
};
