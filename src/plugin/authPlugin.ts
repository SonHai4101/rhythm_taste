import Elysia, { t } from "elysia";
import React from "react";
import { authService } from "../services/authService";

export const authPlugin = new Elysia({
  name: "Plugin.Auth",
  prefix: "/auth",
  tags: ["Auth"],
})
  .use(authService)
  .post(
    "/register",
    async ({ body, register }) => {
      await register(body);
      return {
        message: "Register Successfully",
        data: body,
      };
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, login }) => {
      return login(body);
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  );
