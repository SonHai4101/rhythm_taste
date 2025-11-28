import Elysia, { t } from "elysia";
import { uploadAudioService } from "../services/uploadAudioService";
import { authService } from "../services/authService";

export const uploadAudioPlugin = new Elysia({
  name: "Plugin.UploadAudio",
  prefix: "/audio",
  tags: ["Audio"],
})
  .use(authService)
  .use(uploadAudioService)
  .guard({ isSignIn: true })
  .post(
    "/upload",
    ({ uploadAudio, body }) => {
      return uploadAudio(body.file);
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  )
  .delete(
    "/delete/:id",
    ({ params: { id }, deleteAudio }) => {
      return deleteAudio(id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get(
    "/key/:key",
    ({ params: { key }, getAudioByKey }) => {
      return getAudioByKey(key);
    },
    {
      params: t.Object({
        key: t.String(),
      }),
    }
  );
