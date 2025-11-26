import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { authPlugin } from "./plugin/authPlugin";
import { uploadAudioPlugin } from "./plugin/uploadAudioPlugin";
import { betterUploadPlugin } from "./plugin/betterUploadPlugin";
import { songPlugin } from "./plugin/songPlugin";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "Rhythm Taste",
          description: "Store your own world",
          version: "1.0",
          contact: {
            name: "Me",
            email: "mshai040101@gmail.com",
          },
        },
        tags: [
          {
            name: "Health",
            description: "Health Checkpoint",
          },
          {
            name: "Auth",
            description: "Authentication endpoints",
          },
          {
            name: "Better Upload",
            description: "Upload audio endpoints",
          },
          {
            name: "Song",
            description: "Song endpoints",
          },
        ],
        components: {
          securitySchemes: {
            basicAuth: {
              type: "http",
              scheme: "Bearer",
              description: "Bearer token authentication",
            },
          },
        },
        security: [
          {
            basicAuth: [],
          },
        ],
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .get("/health", () => "OK, working gud!", {
    tags: ["Health"],
  })
  .group("/api", (app) =>
    app
      .use(authPlugin)
      .use(uploadAudioPlugin)
      .use(betterUploadPlugin)
      // .use(songPlugin)
  )
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
