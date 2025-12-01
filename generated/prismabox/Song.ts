import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SongPlain = t.Object(
  {
    id: t.String(),
    title: t.String(),
    artist: __nullable__(t.String()),
    album: __nullable__(t.String()),
    albumCover: __nullable__(t.String()),
    duration: __nullable__(t.Integer()),
    audioId: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const SongRelations = t.Object(
  {
    audio: __nullable__(
      t.Object(
        {
          id: t.String(),
          url: t.String(),
          key: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const SongPlainInputCreate = t.Object(
  {
    title: t.String(),
    artist: t.Optional(__nullable__(t.String())),
    album: t.Optional(__nullable__(t.String())),
    albumCover: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const SongPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    artist: t.Optional(__nullable__(t.String())),
    album: t.Optional(__nullable__(t.String())),
    albumCover: t.Optional(__nullable__(t.String())),
    duration: t.Optional(__nullable__(t.Integer())),
  },
  { additionalProperties: false },
);

export const SongRelationsInputCreate = t.Object(
  {
    audio: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const SongRelationsInputUpdate = t.Partial(
  t.Object(
    {
      audio: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const SongWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          title: t.String(),
          artist: t.String(),
          album: t.String(),
          albumCover: t.String(),
          duration: t.Integer(),
          audioId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Song" },
  ),
);

export const SongWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), audioId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ audioId: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              title: t.String(),
              artist: t.String(),
              album: t.String(),
              albumCover: t.String(),
              duration: t.Integer(),
              audioId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Song" },
);

export const SongSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      title: t.Boolean(),
      artist: t.Boolean(),
      album: t.Boolean(),
      albumCover: t.Boolean(),
      duration: t.Boolean(),
      audioId: t.Boolean(),
      audio: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SongInclude = t.Partial(
  t.Object(
    { audio: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SongOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      artist: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      album: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      albumCover: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      duration: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      audioId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Song = t.Composite([SongPlain, SongRelations], {
  additionalProperties: false,
});

export const SongInputCreate = t.Composite(
  [SongPlainInputCreate, SongRelationsInputCreate],
  { additionalProperties: false },
);

export const SongInputUpdate = t.Composite(
  [SongPlainInputUpdate, SongRelationsInputUpdate],
  { additionalProperties: false },
);
