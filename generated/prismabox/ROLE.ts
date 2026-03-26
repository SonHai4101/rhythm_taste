import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ROLE = t.Union([t.Literal("ADMIN"), t.Literal("USER")], {
  additionalProperties: false,
});
