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

export interface StatusResponse {
  uuid: string;
  status: string; // "Loading model...", "Initialising Data...", "Denoising x/y", "Complete"
  progress: number; // 0-100
}

export interface GetGeneratedImageResponse {
  image_url: string;
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
 * Get the current status of image generation
 * @param uuid - The UUID of the image being generated
 * @returns Promise with the current status and progress
 */
export const getStatus = async (uuid: string): Promise<StatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/status/${uuid}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get status: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Get the generated image as a streaming response
 * @param uuid - The UUID of the generated image
 * @returns Promise with the image URL (blob URL)
 */
export const getGeneratedImage = async (
  uuid: string
): Promise<GetGeneratedImageResponse> => {
  const response = await fetch(`${API_BASE_URL}/edit-result/${uuid}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get image: ${response.statusText}`);
  }

  // Convert the streaming response to a blob and create a URL
  const blob = await response.blob();
  const image_url = URL.createObjectURL(blob);

  return { image_url };
};

// Pose Editor API
export interface UploadPoseImageResponse {
  uuid: string;
  initial_values: {
    pitch: number;
    yaw: number;
    roll: number;
    x_axis: number;
    y_axis: number;
    z_axis: number;
    pout: number;
    pursing: number;
    grin: number;
    lip_open_close: number;
    smile: number;
    wink: number;
    eyebrow: number;
    horizontal_gaze: number;
    vertical_gaze: number;
  };
}

export interface UpdatePoseRequest {
  pitch: number;
  yaw: number;
  roll: number;
  x_axis: number;
  y_axis: number;
  z_axis: number;
  pout: number;
  pursing: number;
  grin: number;
  lip_open_close: number;
  smile: number;
  wink: number;
  eyebrow: number;
  horizontal_gaze: number;
  vertical_gaze: number;
}

export interface UpdatePoseResponse {
  image_url: string;
}

/**
 * Upload an image for pose editing
 * @param file - The image file to upload
 * @returns Promise with the UUID and initial pose values
 */
export const uploadPoseImage = async (file: File): Promise<UploadPoseImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-pose`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload pose image: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Update pose values and get the result image
 * @param uuid - The UUID of the uploaded image
 * @param values - The pose and expression values
 * @returns Promise with the result image URL
 */
export const updatePose = async (uuid: string, values: UpdatePoseRequest): Promise<UpdatePoseResponse> => {
  const response = await fetch(`${API_BASE_URL}/update-pose/${uuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`Failed to update pose: ${response.statusText}`);
  }

  // Convert the streaming response to a blob
  const blob = await response.blob();
  
  // Create a URL for the blob
  const image_url = URL.createObjectURL(blob);

  return { image_url };
};
