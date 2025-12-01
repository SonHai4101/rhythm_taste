import Elysia, { t } from "elysia";
import { authService } from "../services/authService";
import { songService } from "../services/songService";
import {
  SongPlainInputCreate,
  SongPlainInputUpdate,
} from "../../generated/prismabox/Song";

export const songPlugin = new Elysia({
  name: "Plugin.Song",
  prefix: "/song",
  tags: ["Song"],
})
  .use(authService)
  .use(songService)
  .guard({ isSignIn: true })
  // Get all songs
  .get(
    "/",
    async ({ query, getAllSongs }) => {
      return getAllSongs({
        page: query.page || 1,
        limit: query.limit || 20,
        artist: query.artist,
        album: query.album,
      });
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        artist: t.Optional(t.String()),
        album: t.Optional(t.String()),
      }),
    }
  )
  // Create a new song
  .post(
    "/",
    async ({ body, createSong }) => {
      return createSong(body);
    },
    {
      body: t.Object({
        title: t.String(),
        artist: t.Optional(t.Union([t.String(), t.Null()])),
        album: t.Optional(t.Union([t.String(), t.Null()])),
        albumCover: t.Optional(t.Union([t.String(), t.Null()])),
        duration: t.Optional(t.Union([t.Number(), t.Null()])),
        audioId: t.String(),
      }),
    }
  )
  // Search songs by query
  .get(
    "/search",
    async ({ query, searchSongs }) => {
      return searchSongs(query.q);
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1 }),
      }),
    }
  )
  // Get song by ID
  .get(
    "/:id",
    async ({ params, getSongById }) => {
      return getSongById(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  // Update song
  // .put(
  //   "/:id",
  //   async ({ params, body, updateSong }) => {
  //     return updateSong(params.id, body);
  //   },
  //   {
  //     params: t.Object({
  //       id: t.String(),
  //     }),
  //     body: t.Intersect([
  //       SongPlainInputUpdate,
  //       t.Object({
  //         audioUrl: t.Optional(t.String()),
  //         audioKey: t.Optional(t.String()),
  //       }),
  //     ]),
  //   }
  // )
  // Delete song
  .delete(
    "/:id",
    async ({ params, deleteSong }) => {
      return deleteSong(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
