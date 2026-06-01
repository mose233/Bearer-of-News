import { createClient } from "@supabase/supabase-js";

export type UploadMediaResult = {
path: string;
publicUrl: string;
};

const DEFAULT_BUCKET = "xnewsapp-media";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as
| string
| undefined;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
| string
| undefined;

if (!supabaseUrl || !supabaseAnonKey) {
console.warn(
"Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
);
}

const supabase = createClient(
supabaseUrl || "",
supabaseAnonKey || ""
);

function getFileExtension(file: File) {
const fromName = file.name.split(".").pop();

if (fromName && fromName !== file.name) {
return fromName.toLowerCase();
}

if (file.type === "image/png") return "png";
if (file.type === "image/jpeg") return "jpg";
if (file.type === "image/webp") return "webp";
if (file.type === "video/mp4") return "mp4";

return "bin";
}

function createSafeFileName(
file: File,
folder: string
) {
const extension = getFileExtension(file);
const timestamp = Date.now();
const random = Math.random()
.toString(36)
.slice(2, 10);

return `${folder}/${timestamp}-${random}.${extension}`;
}

export async function uploadMediaToPublicStorage({
file,
folder = "creator-media",
bucket = DEFAULT_BUCKET,
}: {
file: File;
folder?: string;
bucket?: string;
}): Promise<UploadMediaResult> {
if (!file) {
throw new Error("No media file provided.");
}

if (!supabaseUrl || !supabaseAnonKey) {
throw new Error(
"Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
);
}

const path = createSafeFileName(file, folder);

const { error: uploadError } = await supabase.storage
.from(bucket)
.upload(path, file, {
cacheControl: "3600",
upsert: false,
contentType:
file.type || "application/octet-stream",
});

if (uploadError) {
throw new Error(
uploadError.message ||
"Failed to upload media."
);
}

const { data } = supabase.storage
.from(bucket)
.getPublicUrl(path);

if (!data.publicUrl) {
throw new Error(
"Failed to create public media URL."
);
}

return {
path,
publicUrl: data.publicUrl,
};
}

export async function uploadBlobToPublicStorage({
blob,
fileName,
folder = "creator-media",
bucket = DEFAULT_BUCKET,
}: {
blob: Blob;
fileName: string;
folder?: string;
bucket?: string;
}): Promise<UploadMediaResult> {
const file = new File([blob], fileName, {
type:
blob.type ||
"application/octet-stream",
});

return uploadMediaToPublicStorage({
file,
folder,
bucket,
});
}
