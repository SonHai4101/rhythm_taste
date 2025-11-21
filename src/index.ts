import { Elysia } from "elysia";

import { swagger } from "@elysiajs/swagger";
import { authPlugin } from "./plugin/authPlugin";
import { uploadAudioPlugin } from "./plugin/uploadAudioPlugin";

const app = new Elysia()
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
            name: "Audio",
            description: "Upload audio endpoints",
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
  .group("/api", (app) => app.use(authPlugin).use(uploadAudioPlugin))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
