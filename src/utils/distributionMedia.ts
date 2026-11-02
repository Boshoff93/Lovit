import { videosApi } from "../services/api";

export async function uploadDistributionVideo(
  userId: string,
  file: File,
  title: string,
  description: string,
  aspectRatio: string,
  onProgress: (value: number) => void,
) {
  if (!/\.(mp4|mov|webm)$/i.test(file.name))
    throw new Error("Choose an MP4, MOV or WebM video.");
  if (file.size > 512 * 1024 * 1024)
    throw new Error("The maximum video size is 512 MB.");
  const fileType =
    file.type ||
    (/\.mov$/i.test(file.name)
      ? "video/quicktime"
      : /\.webm$/i.test(file.name)
        ? "video/webm"
        : "video/mp4");
  const response = await videosApi.getUploadUrl(userId, {
    fileName: file.name,
    fileType,
    fileSize: file.size,
  });
  const { uploadUrl, videoId, videoKey } = response.data;
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", fileType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 90));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error("The video upload failed. Try again."));
    xhr.onerror = () =>
      reject(new Error("The upload connection was interrupted."));
    xhr.send(file);
  });
  onProgress(95);
  try {
    await videosApi.finalizeUpload(userId, {
      videoId,
      videoKey,
      title,
      description,
      aspectRatio,
    });
  } catch (error) {
    throw Object.assign(
      new Error(
        "The file uploaded, but finalization could not be confirmed. Check your media library before uploading again.",
      ),
      { videoId, videoKey, cause: error },
    );
  }
  onProgress(100);
  return videoId as string;
}
export async function thumbnailDataUrl(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPEG, PNG or WebP thumbnail.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("The thumbnail must be 5 MB or smaller.");
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The thumbnail could not be read.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.9);
    if (data.length * 0.75 > 5 * 1024 * 1024)
      throw new Error(
        "The converted thumbnail is too large. Choose a smaller image.",
      );
    return data;
  } finally {
    bitmap.close();
  }
}
