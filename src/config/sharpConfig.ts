import path from "path";
import sharp from "sharp";

export const generateThumbnail = async (
  imagePath: string,
  filename: string,
  width: number,
  height: number
): Promise<any> => {
  const filepath = path.join(
    process.env.FILE_UPLOAD_FOLDER!,
    process.env.THUMB_PREFIX + filename
  );
  return await sharp(imagePath)
    .resize(width, height, { fit: "inside" })
    .toFile(filepath);
};
