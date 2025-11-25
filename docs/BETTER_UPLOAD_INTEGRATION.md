# Better Upload Integration Guide

## Overview

This guide explains how to use the Better Upload plugin with Cloudflare R2 to upload audio files and store them in the database.

## Upload Response Structure

When you successfully upload a file using Better Upload, you'll receive a response like this:

```json
{
  "files": [
    {
      "signedUrl": "https://rhythm-taste.1209bb7b0f9775897af2612b05aa244b.r2.cloudflarestorage.com/...",
      "file": {
        "name": "Justin Bieber - DAISIES (Audio) [msGuqelopMA].mp3",
        "size": 2439315,
        "type": "audio/mpeg",
        "objectInfo": {
          "key": "bccae7fc-f757-4a47-adef-bc88b316d525-justin-bieber-daisies-audio-msguqelopma.mp3",
          "metadata": {}
        }
      }
    }
  ],
  "metadata": {}
}
```

## Frontend Integration

After receiving the upload response, extract the necessary data and create a song record:

```typescript
// 1. Upload the audio file
const uploadResponse = await fetch("http://your-api/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData, // Your audio file form data
});

const uploadData = await uploadResponse.json();

// 2. Extract the key and signed URL
const audioKey = uploadData.files[0].file.objectInfo.key;
const signedUrl = uploadData.files[0].signedUrl;

// 3. Create the song with the audio data
const songResponse = await fetch("http://your-api/song", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "DAISIES",
    artist: "Justin Bieber",
    album: "My Album",
    duration: 180, // duration in seconds
    audioUrl: signedUrl,
    audioKey: audioKey,
  }),
});

const song = await songResponse.json();
```

## Why Store the Key?

The `key` field is stored in the database for several reasons:

1. **File Deletion**: When you delete a song, you can use the key to delete the file from R2 storage
2. **File Management**: Direct access to the file without parsing URLs
3. **Reliability**: URLs can change, but the object key remains constant

## Database Schema

The Audio model now includes the `key` field:

```prisma
model Audio {
  id        String   @id @default(cuid())
  url       String   // The signed URL or public URL
  key       String   // R2 object key for file management
  songId    String   @unique
  song      Song     @relation(fields: [songId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### Create Song with Audio

**POST** `/song`

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 180,
  "audioUrl": "https://...",
  "audioKey": "object-key.mp3"
}
```

### Update Song Audio

**PUT** `/song/:id`

```json
{
  "audioUrl": "https://...",
  "audioKey": "new-object-key.mp3"
}
```

### Delete Song

**DELETE** `/song/:id`

Response includes the audio key for cleanup:

```json
{
  "success": true,
  "message": "Song deleted successfully",
  "audioId": "audio-id",
  "audioKey": "object-key.mp3"
}
```

## Complete Example Flow

```typescript
async function uploadAndCreateSong(audioFile: File, metadata: SongMetadata) {
  try {
    // Step 1: Upload to R2
    const formData = new FormData();
    formData.append("audio", audioFile);

    const uploadRes = await fetch("/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const uploadData = await uploadRes.json();
    const { key } = uploadData.files[0].file.objectInfo;
    const { signedUrl } = uploadData.files[0];

    // Step 2: Create song record
    const songRes = await fetch("/song", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...metadata,
        audioUrl: signedUrl,
        audioKey: key,
      }),
    });

    return await songRes.json();
  } catch (error) {
    console.error("Failed to upload and create song:", error);
    throw error;
  }
}
```

## Notes

- The `signedUrl` has an expiration time (120 seconds in the example)
- You may want to convert the signed URL to a public URL or handle URL generation on the backend
- Make sure to handle errors appropriately in production
- Consider adding file type validation and size limits
