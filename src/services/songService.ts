import Elysia from "elysia";
import db from "../db";

type CreateSongInput = {
  title: string;
  artist?: string | null;
  album?: string | null;
  albumCoverIds?: string[];
  duration?: number | null;
  audioId: string;
};

type UpdateSongInput = {
  title?: string;
  artist?: string | null;
  album?: string | null;
  albumCoverIds?: string[];
  duration?: number | null;
  categoryId?: string | null;
};

const songInclude = {
  albumCover: true,
  audio: true,
  category: true,
} as const;

export const songService = new Elysia().derive(
  { as: "scoped" },
  ({ status }) => {
    const createSong = async (data: CreateSongInput) => {
      try {
        const song = await db.song.create({
          data: {
            title: data.title,
            artist: data.artist,
            album: data.album,
            duration: data.duration,
            audioId: data.audioId,
            ...(data.albumCoverIds?.length
              ? {
                  albumCover: {
                    connect: data.albumCoverIds.map((id) => ({ id })),
                  },
                }
              : {}),
          },
          include: songInclude,
        });

        return song;
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to create song: ${error.message}`,
        });
      }
    };

    const updateSong = async (id: string, data: UpdateSongInput) => {
      try {
        const existingSong = await db.song.findUnique({ where: { id } });
        if (!existingSong) {
          throw status(404, { success: false, message: "Song not found" });
        }

        let categoryId = existingSong.categoryId;
        if (data.categoryId !== undefined) {
          if (data.categoryId === null) {
            categoryId = null;
          } else {
            const categoryExists = await db.category.findUnique({
              where: { id: data.categoryId },
            });
            if (categoryExists) {
              categoryId = data.categoryId;
            }
          }
        }

        return await db.song.update({
          where: { id },
          data: {
            title: data.title,
            artist: data.artist,
            album: data.album,
            duration: data.duration,
            categoryId,
            ...(data.albumCoverIds !== undefined
              ? {
                  albumCover: {
                    set: data.albumCoverIds.map((coverId) => ({ id: coverId })),
                  },
                }
              : {}),
          },
          include: songInclude,
        });
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to update song: ${error.message}`,
        });
      }
    };

    const getAllSongs = async (params: {
      page: number;
      limit: number;
      artist?: string;
      album?: string;
    }) => {
      try {
        const { page = 1, limit = 20, artist, album } = params;
        const skip = (page - 1) * limit;

        const whereConditions: any[] = [];
        if (artist) {
          whereConditions.push({
            artist: { contains: artist, mode: "insensitive" },
          });
        }
        if (album) {
          whereConditions.push({
            album: { contains: album, mode: "insensitive" },
          });
        }
        const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

        const total = await db.song.count({ where });
        const data = await db.song.findMany({
          where,
          include: songInclude,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        });

        return {
          data,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to fetch songs: ${error.message}`,
        });
      }
    };

    const getSongById = async (id: string) => {
      try {
        const song = await db.song.findUnique({
          where: { id },
          include: songInclude,
        });
        if (!song) {
          throw status(404, {
            success: false,
            message: "Song not found",
          });
        }
        return song;
      } catch (error: any) {
        if (error.status === 404) throw error;
        throw status(400, {
          success: false,
          message: `Failed to fetch song: ${error.message}`,
        });
      }
    };

    const deleteSong = async (id: string) => {
      try {
        const song = await db.song.findUnique({
          where: { id },
          include: { audio: true },
        });

        if (!song) {
          throw status(404, {
            success: false,
            message: "Song not found",
          });
        }

        await db.song.delete({
          where: { id },
        });

        return {
          success: true,
          message: "Song deleted successfully",
          audioId: song.audio?.id,
          audioKey: song.audio?.key,
        };
      } catch (error: any) {
        if (error.status === 404) throw error;
        throw status(400, {
          success: false,
          message: `Failed to delete song: ${error.message}`,
        });
      }
    };

    const searchSongs = async (query: string) => {
      try {
        const songs = await db.song.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { artist: { contains: query, mode: "insensitive" } },
              { album: { contains: query, mode: "insensitive" } },
            ],
          },
          include: songInclude,
          orderBy: {
            createdAt: "desc",
          },
        });
        return songs;
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to search songs: ${error.message}`,
        });
      }
    };

    return {
      createSong,
      getAllSongs,
      getSongById,
      updateSong,
      deleteSong,
      searchSongs,
    };
  },
);
