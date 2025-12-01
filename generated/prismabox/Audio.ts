import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AudioPlain = t.Object(
  {
    id: t.String(),
    url: t.String(),
    key: t.String(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AudioRelations = t.Object(
  {
    song: __nullable__(
      t.Object(
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
      ),
    ),
  },
  { additionalProperties: false },
);

export const AudioPlainInputCreate = t.Object(
  { url: t.String(), key: t.String() },
  { additionalProperties: false },
);

export const AudioPlainInputUpdate = t.Object(
  { url: t.Optional(t.String()), key: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const AudioRelationsInputCreate = t.Object(
  {
    song: t.Optional(
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

export const AudioRelationsInputUpdate = t.Partial(
  t.Object(
    {
      song: t.Partial(
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

export const AudioWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          url: t.String(),
          key: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Audio" },
  ),
);

export const AudioWhereUnique = t.Recursive(
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
              url: t.String(),
              key: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Audio" },
);

export const AudioSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      url: t.Boolean(),
      key: t.Boolean(),
      song: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AudioInclude = t.Partial(
  t.Object(
    { song: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AudioOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      url: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      key: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Audio = t.Composite([AudioPlain, AudioRelations], {
  additionalProperties: false,
});

export const AudioInputCreate = t.Composite(
  [AudioPlainInputCreate, AudioRelationsInputCreate],
  { additionalProperties: false },
);

export const AudioInputUpdate = t.Composite(
  [AudioPlainInputUpdate, AudioRelationsInputUpdate],
  { additionalProperties: false },
);
