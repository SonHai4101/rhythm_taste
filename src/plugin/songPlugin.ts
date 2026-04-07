import Elysia, { t } from "elysia";
import { authService } from "../services/authService";
import { songService } from "../services/songService";

export const songPlugin = new Elysia({
  name: "Plugin.Song",
  prefix: "/song",
  tags: ["Song"],
})
  .use(authService)
  .use(songService)
  .guard({ isSignIn: true })
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
    },
  )
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
        albumCoverIds: t.Optional(t.Array(t.String())),
        duration: t.Optional(t.Union([t.Number(), t.Null()])),
        audioId: t.String(),
      }),
    },
  )
  .get(
    "/search",
    async ({ query, searchSongs }) => {
      return searchSongs(query.q);
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1 }),
      }),
    },
  )
  .get(
    "/:id",
    async ({ params, getSongById }) => {
      return getSongById(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .put(
    "/:id",
    async ({ params, body, updateSong }) => {
      return updateSong(params.id, body);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        artist: t.Optional(t.Nullable(t.String())),
        album: t.Optional(t.Nullable(t.String())),
        albumCoverIds: t.Optional(t.Array(t.String())),
        duration: t.Optional(t.Nullable(t.Number())),
        categoryId: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, deleteSong }) => {
      return deleteSong(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
