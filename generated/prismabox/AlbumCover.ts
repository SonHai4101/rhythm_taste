import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AlbumCoverPlain = t.Object(
  {
    id: t.String(),
    key: t.String(),
    url: t.String(),
    songId: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AlbumCoverRelations = t.Object(
  {
    song: t.Object(
      {
        id: t.String(),
        title: t.String(),
        artist: __nullable__(t.String()),
        album: __nullable__(t.String()),
        duration: __nullable__(t.Integer()),
        audioId: __nullable__(t.String()),
        categoryId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AlbumCoverPlainInputCreate = t.Object(
  { key: t.String(), url: t.String() },
  { additionalProperties: false },
);

export const AlbumCoverPlainInputUpdate = t.Object(
  { key: t.Optional(t.String()), url: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const AlbumCoverRelationsInputCreate = t.Object(
  {
    song: t.Object(
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
  },
  { additionalProperties: false },
);

export const AlbumCoverRelationsInputUpdate = t.Partial(
  t.Object(
    {
      song: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const AlbumCoverWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          key: t.String(),
          url: t.String(),
          songId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AlbumCover" },
  ),
);

export const AlbumCoverWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              key: t.String(),
              url: t.String(),
              songId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AlbumCover" },
);

export const AlbumCoverSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      key: t.Boolean(),
      url: t.Boolean(),
      songId: t.Boolean(),
      song: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AlbumCoverInclude = t.Partial(
  t.Object(
    { song: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AlbumCoverOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      url: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      songId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AlbumCover = t.Composite([AlbumCoverPlain, AlbumCoverRelations], {
  additionalProperties: false,
});

export const AlbumCoverInputCreate = t.Composite(
  [AlbumCoverPlainInputCreate, AlbumCoverRelationsInputCreate],
  { additionalProperties: false },
);

export const AlbumCoverInputUpdate = t.Composite(
  [AlbumCoverPlainInputUpdate, AlbumCoverRelationsInputUpdate],
  { additionalProperties: false },
);
