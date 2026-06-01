import { supabase } from "@/lib/supabase";

type UploadMediaArgs = {
  file: File;
  folder?: string;
  bucket?: string;
};

type UploadBlobArgs = {
  blob: Blob;
  fileName: string;
  folder?: string;
  bucket?: string;
};

type UploadResult = {
  path: string;
  publicUrl: string;
};

const DEFAULT_BUCKET = "media";

function safeFileName(name: string) {
  const extension = name.includes(".")
    ? name.split(".").pop()
    : "bin";

  const base = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base || "xnewsapp-media"}-${Date.now()}.${extension}`;
}

async function uploadToPublicStorage({
  body,
  fileName,
  folder = "uploads",
  bucket = DEFAULT_BUCKET,
  contentType,
}: {
  body: File | Blob;
  fileName: string;
  folder?: string;
  bucket?: string;
  contentType?: string;
}): Promise<UploadResult> {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");

  const path = `${cleanFolder}/${safeFileName(fileName)}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });

  if (error) {
    throw new Error(
      `Failed to upload media to Supabase Storage: ${error.message}`
    );
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error(
      "Media uploaded, but no public URL was returned."
    );
  }

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

export async function uploadMediaToPublicStorage({
  file,
  folder = "uploads",
  bucket = DEFAULT_BUCKET,
}: UploadMediaArgs): Promise<UploadResult> {
  return uploadToPublicStorage({
    body: file,
    fileName: file.name,
    folder,
    bucket,
    contentType: file.type,
  });
}

export async function uploadBlobToPublicStorage({
  blob,
  fileName,
  folder = "uploads",
  bucket = DEFAULT_BUCKET,
}: UploadBlobArgs): Promise<UploadResult> {
  return uploadToPublicStorage({
    body: blob,
    fileName,
    folder,
    bucket,
    contentType:
      blob.type || "application/octet-stream",
  });
}
