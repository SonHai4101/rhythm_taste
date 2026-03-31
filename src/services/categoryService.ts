import Elysia, { status } from "elysia";
import db from "../db";

export const categoryService = new Elysia().derive(
  { as: "scoped" },
  ({ status }) => {
    const getCategories = async () => {
      try {
        const categories = await db.category.findMany();
        return categories;
      } catch (error) {
        throw status(500, {
          success: false,
          message: "Failed to fetch categories",
        });
      }
    };
    const createCategory = async (data: { name: string }) => {
      try {
        const category = await db.category.create({
          data: {
            name: data.name,
          },
        });
        return category;
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to create category: ${error.message}`,
        });
      }
    };

    const getCategoryById = async (id: string) => {
      try {
        const category = await db.category.findUnique({
          where: { id },
        });
        if (!category) {
          throw status(404, {
            success: false,
            message: "Category not found",
          });
        }
        return category;
      } catch (error: any) {
        throw status(500, {
          success: false,
          message: `Failed to fetch category: ${error.message}`,
        });
      }
    };

    const deleteCategory = async (categoryId: string) => {
      try {
        const category = await db.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          throw status(404, {
            success: false,
            message: "Category not found",
          });
        }
        await db.category.delete({
          where: { id: categoryId },
        });
      } catch (error) {
        throw status(500, {
          success: false,
          message: "Failed to delete category",
        });
      }
    };
    return {
      getCategories,
      createCategory,
      getCategoryById,
      deleteCategory,
    };
  },
);
