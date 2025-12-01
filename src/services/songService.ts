import Elysia from "elysia";
import { Prisma } from "../generated/prisma/client";
import db from "../db";

export const songService = new Elysia().derive(
  { as: "scoped" },
  ({ status }) => {
    // Create a new song
    const createSong = async (
      data: Omit<Prisma.SongCreateInput, "audio"> & {
        audioId: string;
      }
    ) => {
      try {
        const song = await db.song.create({
          data: {
            title: data.title,
            artist: data.artist,
            album: data.album,
            albumCover: data.albumCover,
            duration: data.duration,
            audioId: data.audioId,
          },
          include: {
            audio: true,
          },
        });
        return song;
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to create song: ${error.message}`,
        });
      }
    };

    // Get all songs
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
        if (artist)
          whereConditions.push({
            artist: { contains: artist, mode: "insensitive" },
          });
        if (album)
          whereConditions.push({
            album: { contains: album, mode: "insensitive" },
          });
        const where =
          whereConditions.length > 0 ? { AND: whereConditions } : {};

        // Get total count for pagination
        const total = await db.song.count({ where });

        const data = await db.song.findMany({
          where,
          include: {
            audio: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        });
        return {data, pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },};
      } catch (error: any) {
        throw status(400, {
          success: false,
          message: `Failed to fetch songs: ${error.message}`,
        });
      }
    };

    // Get song by ID
    const getSongById = async (id: string) => {
      try {
        const song = await db.song.findUnique({
          where: { id },
          include: {
            audio: true,
          },
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

    // Update song
    // const updateSong = async (
    //   id: string,
    //   data: Partial<Omit<Prisma.SongUpdateInput, "audio">> & {
    //     audioUrl?: string;
    //     audioKey?: string;
    //   }
    // ) => {
    //   try {
    //     const existingSong = await db.song.findUnique({
    //       where: { id },
    //       include: { audio: true },
    //     });

    //     if (!existingSong) {
    //       throw status(404, {
    //         success: false,
    //         message: "Song not found",
    //       });
    //     }

    //     const updateData: any = {
    //       ...(data.title && { title: data.title }),
    //       ...(data.artist !== undefined && { artist: data.artist }),
    //       ...(data.album !== undefined && { album: data.album }),
    //       ...(data.duration !== undefined && { duration: data.duration }),
    //     };

    //     // Handle audio update
    //     if (data.audioUrl && data.audioKey) {
    //       if (existingSong.audio) {
    //         // Update existing audio
    //         updateData.audio = {
    //           update: {
    //             url: data.audioUrl,
    //             key: data.audioKey,
    //           },
    //         };
    //       } else {
    //         // Create new audio
    //         updateData.audio = {
    //           create: {
    //             url: data.audioUrl,
    //             key: data.audioKey,
    //           },
    //         };
    //       }
    //     }

    //     const updatedSong = await db.song.update({
    //       where: { id },
    //       data: updateData,
    //       include: {
    //         audio: true,
    //       },
    //     });

    //     return updatedSong;
    //   } catch (error: any) {
    //     if (error.status === 404) throw error;
    //     throw status(400, {
    //       success: false,
    //       message: `Failed to update song: ${error.message}`,
    //     });
    //   }
    // };

    // Delete song
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

        // Delete the song (audio will be deleted automatically due to cascade)
        await db.song.delete({
          where: { id },
        });

        return {
          success: true,
          message: "Song deleted successfully",
          audioId: song.audio?.id, // Return audio ID so caller can delete from storage
          audioKey: song.audio?.key, // Return R2 key for storage deletion
        };
      } catch (error: any) {
        if (error.status === 404) throw error;
        throw status(400, {
          success: false,
          message: `Failed to delete song: ${error.message}`,
        });
      }
    };

    // Search songs by title or artist
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
          include: {
            audio: true,
          },
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
      //   updateSong,
      deleteSong,
      searchSongs,
    };
  }
);
