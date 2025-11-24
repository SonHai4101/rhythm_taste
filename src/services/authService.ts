import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { Prisma } from "../generated/prisma/client";
import db from "../db";
import { resolve } from "path";

export const authService = new Elysia({ name: "Service.Auth" })
  .use(
    jwt({
      name: "accessToken",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    })
  )
  .use(bearer())
  .derive({ as: "scoped" }, ({ status, accessToken, bearer }) => {
    const register = async (body: Prisma.UserCreateInput) => {
      const existingUsername = await db.user.findUnique({
        where: {
          username: body.username,
        },
      });
      if (existingUsername) {
        throw status(409, {
          success: false,
          message: "Username already exists",
        });
      }
      const hashedPassword = await Bun.password.hash(body.password, "bcrypt");
      return db.user.create({
        data: {
          username: body.username,
          email: body.email,
          password: hashedPassword,
        },
      });
    };

    const login = async (
      body: Pick<Prisma.UserCreateInput, "username" | "password">
    ) => {
      const user = await db.user.findUnique({
        where: {
          username: body.username,
        },
      });
      if (!user)
        throw status(404, {
          success: false,
          message: "User not found",
        });
      const isValidPassword = await Bun.password.verify(
        String(body.password),
        user.password,
        "bcrypt"
      );
      if (!isValidPassword)
        throw status(401, {
          success: false,
          message: "Invalid password",
        });
      const { password, ...userWithoutPassword } = user;
      const token = await accessToken.sign({
        sub: String(userWithoutPassword.id),
        email: String(userWithoutPassword.email),
      });
      return {
        user: userWithoutPassword,
        accessToken: token,
      };
    };

    const getUserInfo = async () => {
      if (!bearer) throw status(401, "Unauthorized");
      const payload = await accessToken.verify(bearer);
      if (!payload) throw status(401, "Invalid or expired token");
      const user = await db.user.findUnique({
        where: {
          id: Number(payload.sub),
        },
      });
      if (!user) throw status(401, "User not found");
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    };
    return {
      register,
      login,
      getUserInfo,
    };
  })
  .macro({
    isSignIn(enabled: boolean) {
      if (!enabled) return;
      return {
        async resolve({ accessToken, bearer, status }) {
          if (!bearer) throw status(401, "Unauthorized");
          const payload = await accessToken.verify(bearer);
          if (!payload) throw status(401, "Invalid or expired token");
        },
      };
    },
  });
