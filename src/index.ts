import { Elysia } from "elysia";

import { swagger } from "@elysiajs/swagger";
import { authPlugin } from "./plugin/authPlugin";

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
            name: "health",
            description: "Health Checkpoint",
          },
          {
            name: "Auth",
            description: "Authentication endpoints",
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
    tags: ["health"],
  })
  .group("/api", (app) => app.use(authPlugin))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
