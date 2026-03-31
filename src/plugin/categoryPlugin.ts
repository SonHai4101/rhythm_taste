import Elysia, { t } from "elysia";
import { authService } from "../services/authService";
import { categoryService } from "../services/categoryService";

export const categoryPlugin = new Elysia({
  name: "Plugin.Category",
  prefix: "/category",
  tags: ["Category"],
})
  .use(authService)
  .use(categoryService)
  .guard({ isSignIn: true })
  .get("/", async ({ getCategories }) => {
    return getCategories();
  })
  .post(
    "/",
    async ({ body, createCategory }) => {
      return createCategory(body);
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  )
  .get(
    "/:id",
    async ({ params, getCategoryById }) => {
      return getCategoryById(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, deleteCategory }) => {
      return deleteCategory(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
