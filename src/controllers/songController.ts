// import { Elysia } from "elysia";
// import * as songService from "../services/songService";
// import fs from "fs/promises";
// import path from "path";

// const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// function contentTypeFromName(name: string) {
//   const ext = name.split('.').pop()?.toLowerCase();
//   switch (ext) {
//     case 'mp3': return 'audio/mpeg';
//     case 'wav': return 'audio/wav';
//     case 'ogg': return 'audio/ogg';
//     case 'm4a': return 'audio/mp4';
//     default: return 'application/octet-stream';
//   }
// }

// export default function songPlugin(app: Elysia) {
//   // Upload endpoint: accepts JSON with base64 file data
//   app.post('/songs/upload', async (c) => {
//     const body = await c.body;
//     const { filename, fileBase64, title, artist, album, duration } = body ?? {};

//     if (!filename || !fileBase64 || !title) {
//       return { success: false, message: 'filename, fileBase64 and title are required' };
//     }

//     const song = await songService.uploadSong({ filename, fileBase64, title, artist, album, duration });

//     return { success: true, song };
//   });

//   // Serve uploaded files
//   app.get('/uploads/:name', async (c) => {
//     const { name } = c.params as { name: string };
//     const full = path.join(UPLOAD_DIR, name);

//     const stat = await fs.stat(full).catch(() => null);
//     if (!stat) {
//       return { status: 404, message: 'Not found' };
//     }

//     const buffer = await fs.readFile(full);
//     const ct = contentTypeFromName(name);
//     return new Response(buffer, { headers: { 'Content-Type': ct } });
//   });

//   return app;
// }
