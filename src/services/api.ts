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
}

export interface StartPoseInitializeResponse {
  task_id: string;
  status: string;
}

export interface PoseStatusResponse {
  uuid: string;
  status: string;
  progress: number;
}

export interface PoseValuesResponse {
  uuid: string;
  eyes: number;
  lips: number;
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
  eye_open_close: number;
}

export interface UpdatePoseResponse {
  image_url: string;
}

/**
 * Upload an image for pose editing
 * @param file - The image file to upload
 * @returns Promise with the UUID
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
 * Start initialize job for pose editing
 * @param uuid - The UUID of the uploaded image
 * @returns Promise with task ID and status
 */
export const startPoseInitialize = async (uuid: string): Promise<StartPoseInitializeResponse> => {
  const response = await fetch(`${API_BASE_URL}/pose-job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid: uuid,
      job: "initialize"
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start initialization: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get the current status of pose job
 * @param uuid - The UUID of the image being processed
 * @returns Promise with the current status and progress
 */
export const getPoseStatus = async (uuid: string): Promise<PoseStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/status/${uuid}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get pose status: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Get the slider values after initialization
 * @param uuid - The UUID of the processed image
 * @returns Promise with eyes and lips values
 */
export const getPoseValues = async (uuid: string): Promise<PoseValuesResponse> => {
  const response = await fetch(`${API_BASE_URL}/get_values/${uuid}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get pose values: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Trigger retarget job with pose values
 * @param uuid - The UUID of the uploaded image
 * @param values - The pose and expression values
 * @returns Promise with task ID and status
 */
export const retargetPose = async (uuid: string, values: UpdatePoseRequest): Promise<{ task_id: string; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/pose-job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid: uuid,
      job: "retarget",
      ...values
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to retarget pose: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get the result image after retargeting
 * @param uuid - The UUID of the image
 * @returns Promise with the result image URL
 */
export const getRetargetedImage = async (uuid: string): Promise<UpdatePoseResponse> => {
  const response = await fetch(`${API_BASE_URL}/get_image/${uuid}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get retargeted image: ${response.statusText}`);
  }

  // Convert the streaming response to a blob
  const blob = await response.blob();
  
  // Create a URL for the blob
  const image_url = URL.createObjectURL(blob);

  return { image_url };
};
