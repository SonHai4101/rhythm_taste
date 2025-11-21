// import prisma from "../db";
// import fs from "fs/promises";
// import path from "path";

// const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// async function ensureUploadDir() {
//   try {
//     await fs.mkdir(UPLOAD_DIR, { recursive: true });
//   } catch (e) {
//     // ignore
//   }
// }

// type UploadInput = {
//   filename: string;
//   fileBase64: string;
//   title: string;
//   artist?: string | null;
//   album?: string | null;
//   duration?: number | null;
// };

// export async function uploadSong(input: UploadInput) {
//   const { filename, fileBase64, title, artist, album, duration } = input;

//   await ensureUploadDir();

//   const buffer = Buffer.from(fileBase64, "base64");

//   const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
//   const name = `${Date.now()}-${safe}`;
//   const filePath = path.join(UPLOAD_DIR, name);

//   await fs.writeFile(filePath, buffer);

//   const fileUrl = `/uploads/${name}`;

//   const song = await prisma.song.create({
//     data: {
//       title,
//       artist: artist ?? null,
//       album: album ?? null,
//       duration: duration ?? null,
//       fileUrl,
//     },
//   });

//   return song;
// }
