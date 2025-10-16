// API service for communicating with FastAPI backend
// Configure your FastAPI base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface UploadImageResponse {
  uuid: string;
  message?: string;
}

export interface GenerateImageRequest {
  uuid: string;
  prompt: string;
  model: string;
}

export interface GenerateImageResponse {
  task_id: string;
  status: string;
  message?: string;
}

export interface GetGeneratedImageResponse {
  status: "pending" | "processing" | "completed" | "failed";
  image_url?: string;
  error?: string;
}

/**
 * Upload an image file to the FastAPI backend
 * @param file - The image file to upload
 * @returns Promise with the UUID of the uploaded image
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Upload a binary mask to the FastAPI backend
 * @param uuid - The UUID of the uploaded image
 * @param maskFile - The binary mask file to upload
 * @returns Promise with success status
 */
export const uploadMask = async (uuid: string, maskFile: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("file", maskFile);

  const response = await fetch(`${API_BASE_URL}/upload-mask/${uuid}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Mask upload failed: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Generate/edit an image using the provided parameters
 * @param request - The generation request parameters
 * @returns Promise with the task ID for tracking generation
 */
export const generateImage = async (
  request: GenerateImageRequest
): Promise<GenerateImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Poll for the generated image result
 * @param taskId - The task ID from the generate endpoint
 * @returns Promise with the generation status and image URL when ready
 */
export const getGeneratedImage = async (
  taskId: string
): Promise<GetGeneratedImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/result/${taskId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get result: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Poll for generated image with automatic retries
 * @param taskId - The task ID to poll for
 * @param maxAttempts - Maximum number of polling attempts (default: 60)
 * @param intervalMs - Milliseconds between polls (default: 2000)
 * @returns Promise with the final image URL
 */
export const pollForGeneratedImage = async (
  taskId: string,
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<string> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getGeneratedImage(taskId);

    if (result.status === "completed" && result.image_url) {
      return result.image_url;
    }

    if (result.status === "failed") {
      throw new Error(result.error || "Image generation failed");
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Image generation timed out");
};
