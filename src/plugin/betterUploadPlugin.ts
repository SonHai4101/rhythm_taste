import Elysia from "elysia";
import { handleRequest, route, type Router } from "@better-upload/server";
import { cloudflare } from "@better-upload/server/clients";
import { authService } from "../services/authService";
import prisma from "../db";

const s3 = cloudflare({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
});

const router: Router = {
  client: s3, // or cloudflare(), backblaze(), tigris(), ...
  bucketName: process.env.R2_BUCKET_NAME!,
  routes: {
    audio: route({
      multipleFiles: true, // Enable multiple file uploads
      maxFiles: 10, // Maximum 10 files at once (default is 3)
      fileTypes: ["audio/mpeg"],
      maxFileSize: 100 * 1024 * 1024,
      onAfterSignedUrl: async ({ files }) => {
        // Create Audio records for all uploaded files
        await Promise.all(
          files.map(async (file) => {
            const key = file.objectInfo.key;
            const publicUrl = `${process.env.AUDIO_R2_PUBLIC_URL}/${key}`;

            await prisma.audio.create({
              data: {
                key: key,
                url: publicUrl,
              },
            });
          })
        );
      },
    }),
  },
};
 
export const betterUploadPlugin = new Elysia({
  name: "Plugin.BetterUpload",
  prefix: "/upload",
  tags: ["Better Upload"],
})
  .use(authService)
  .guard({ isSignIn: true })
  .post("/", ({ request }) => {
    return handleRequest(request, router);
  });
