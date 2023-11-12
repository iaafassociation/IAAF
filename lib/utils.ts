import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "hwmcxhyd");
  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/dpgisqw9q/image/upload",
    formData
  );
  return data?.secure_url;
};
