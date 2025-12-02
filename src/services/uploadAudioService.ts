import Elysia from "elysia";
import { r2 } from "../libs/r2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../db";

export const uploadAudioService = new Elysia().derive(
  { as: "scoped" },
  ({ status }) => {
    const uploadAudio = async (file: File) => {
      let url: string = "";

      const ext = file.name?.split(".").pop();
      const name = file.name?.replace(`.${ext}`, "");
      const cleanName = name?.replace(/[^a-zA-Z0-9]/g, "_");

      const objectKey = `${Date.now()}_${cleanName}.${ext}`;
      const bucket = process.env.R2_BUCKET_NAME!;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: buffer,
            ContentType: file.type,
          })
        );

        const publicUrl = `${process.env.R2_PUBLIC_URL}/${bucket}/${objectKey}`;
        url = publicUrl;
      } catch (error: any) {
        throw status(400, `Failed to upload audio: ${error.message}`);
      }

      return { url, key: objectKey };
    };

    const deleteAudio = async (audioId: string) => {
      const audio = await prisma.audio.findUnique({
        where: { id: audioId },
      });
      if (!audio) throw status(404, "Audio file Not Found");

      try {
        // Use the stored key instead of parsing from URL
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: audio.key,
          })
        );
        await prisma.audio.delete({
          where: { id: audioId },
        });
        return {
          success: true,
          message: "Audio delete successfully",
          audioId: audio.id,
          audioKey: audio.key,
        };
      } catch (error: any) {
        throw status(400, `Error deleting audio: ${error.message}`);
      }
    };

    const getAudioByKey = async (key: string) => {
      const audio = await prisma.audio.findFirst({
        where: { key },
      });
      if (!audio) throw status(404, "Audio file not found");
      return audio;
    };

    // const updateAudioMeta = async (audioId: string) => {
    //      const audio = await prisma.audio.findUnique({
    //         where: { id: audioId }
    //     })
    //     if(!audio) throw status(404, "Audio file Not Found")
    //         return  await prisma.audio.update({
    //             where: { id: audioId },
    //         })
    // }

    return {
      uploadAudio,
      deleteAudio,
      getAudioByKey,
    };
  }
);
