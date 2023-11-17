import sharp from "sharp";

export const generateThumbnail = async (
  buffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> => {
  return await sharp(buffer).resize(width, height).toBuffer();
};
