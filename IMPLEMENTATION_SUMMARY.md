# Audio Upload Implementation Summary

## What Was Changed

### 1. Database Schema (`/rhythm_taste/prisma/schema.prisma`)

- ✅ Added `key` field to the `Audio` model to store the R2 object key
- ✅ Migration created and applied: `20251125091330_add_audio_key`

### 2. Backend Services

#### Song Service (`/rhythm_taste/src/services/songService.ts`)

- ✅ Updated `createSong` to accept and store `audioKey`
- ✅ Updated `updateSong` to accept and store `audioKey`
- ✅ Updated `deleteSong` to return `audioKey` for cleanup

#### Upload Audio Service (`/rhythm_taste/src/services/uploadAudioService.ts`)

- ✅ Updated `uploadAudio` to return both `url` and `key`
- ✅ Updated `deleteAudio` to use stored `key` instead of parsing URL

### 3. API Endpoints

#### Song Plugin (`/rhythm_taste/src/plugin/songPlugin.ts`)

- ✅ Added `audioKey` to POST `/song` request body
- ✅ Added `audioKey` to PUT `/song/:id` request body

### 4. Documentation

- ✅ Created `/rhythm_taste/docs/BETTER_UPLOAD_INTEGRATION.md` - Backend integration guide
- ✅ Created `/rhythm-taste-fe/src/examples/uploadAndCreateSong.ts` - Frontend example

## How to Use

### Backend API

Your Better Upload endpoint returns:

```json
{
  "files": [
    {
      "signedUrl": "https://...",
      "file": {
        "objectInfo": {
          "key": "bccae7fc-f757-4a47-adef-bc88b316d525-file.mp3"
        }
      }
    }
  ]
}
```

### Create Song with Audio

**Endpoint:** `POST /song`

**Request Body:**

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 180,
  "audioUrl": "https://rhythm-taste...r2.cloudflarestorage.com/...",
  "audioKey": "bccae7fc-f757-4a47-adef-bc88b316d525-file.mp3"
}
```

### Frontend Integration

```typescript
// 1. Upload file to /upload endpoint
const uploadRes = await fetch("/upload", {
  method: "POST",
  body: formData,
});
const uploadData = await uploadRes.json();

// 2. Extract key and URL
const audioKey = uploadData.files[0].file.objectInfo.key;
const audioUrl = uploadData.files[0].signedUrl;

// 3. Create song
await songService.createSong({
  title: "Song Title",
  audioUrl,
  audioKey,
});
```

## Benefits

1. **Reliable File Deletion**: Use stored key to delete from R2
2. **No URL Parsing**: Direct access to object key
3. **Future-Proof**: URLs can change, keys don't

## Next Steps

1. Update your frontend `Uploader` component to extract and use the `objectInfo.key`
2. Update any existing songs in the database to include the key (if needed)
3. Consider adding a migration script for existing records
4. Test the complete flow: upload → create song → delete song

## Testing Checklist

- [ ] Upload audio file via Better Upload
- [ ] Verify response contains `objectInfo.key`
- [ ] Create song with audioUrl and audioKey
- [ ] Verify Audio record has both url and key fields
- [ ] Delete song and verify file is removed from R2
- [ ] Test update song with new audio file

## Important Notes

- Both `audioUrl` and `audioKey` must be provided together
- The signed URL from Better Upload expires (120s in your case)
- Consider using public URLs or regenerating signed URLs as needed
- The key is essential for file management and cleanup
