# Complete Audio Upload Flow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 1. User selects audio file
                                ▼
                        ┌───────────────┐
                        │  FormData     │
                        │  with File    │
                        └───────────────┘
                                │
                                │ 2. POST /upload
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Better Upload Plugin                   │
│                  /src/plugin/betterUploadPlugin.ts                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 3. Upload to Cloudflare R2
                                ▼
                        ┌───────────────┐
                        │ Cloudflare R2 │
                        │   Storage     │
                        └───────────────┘
                                │
                                │ 4. Returns response
                                ▼
                    ┌─────────────────────┐
                    │  Upload Response    │
                    │  {                  │
                    │    files: [{        │
                    │      signedUrl,     │
                    │      file: {        │
                    │        objectInfo: {│
                    │          key: "..." │
                    │        }             │
                    │      }               │
                    │    }]                │
                    │  }                   │
                    └─────────────────────┘
                                │
                                │ 5. Extract key & URL
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│                                                                     │
│   const audioKey = response.files[0].file.objectInfo.key           │
│   const audioUrl = response.files[0].signedUrl                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 6. POST /song with audioUrl & audioKey
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Song Plugin                            │
│                  /src/plugin/songPlugin.ts                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 7. Call createSong()
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Song Service                           │
│                  /src/services/songService.ts                       │
│                                                                     │
│   Creates Song record with Audio relation:                         │
│   {                                                                 │
│     title, artist, album, duration,                                │
│     audio: {                                                        │
│       create: {                                                     │
│         url: audioUrl,                                              │
│         key: audioKey  ← Stored for future use!                    │
│       }                                                             │
│     }                                                               │
│   }                                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ 8. Save to database
                                ▼
                    ┌─────────────────────┐
                    │   PostgreSQL DB     │
                    │                     │
                    │  Song Table:        │
                    │  - id               │
                    │  - title            │
                    │  - artist           │
                    │  - album            │
                    │  - duration         │
                    │                     │
                    │  Audio Table:       │
                    │  - id               │
                    │  - url   ← signedUrl│
                    │  - key   ← R2 key   │
                    │  - songId           │
                    └─────────────────────┘
                                │
                                │ 9. Return created song
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│                                                                     │
│   Display song in UI with audio player                             │
│   Can now play, edit, or delete the song                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Delete Flow (Bonus)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│                  User clicks "Delete Song"                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ DELETE /song/:id
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Song Service                           │
│                                                                     │
│   1. Find song with audio                                           │
│   2. Delete song from DB (cascade deletes audio record)            │
│   3. Return: { success, audioKey: "..." }                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Optional: Use audioKey to delete from R2
                                ▼
                    ┌─────────────────────┐
                    │  DELETE from R2     │
                    │  using audioKey     │
                    └─────────────────────┘
```

## Key Points

1. **Upload**: Better Upload handles file upload to R2
2. **Extract**: Frontend extracts `key` from upload response
3. **Store**: Backend stores both `url` and `key` in database
4. **Delete**: Use stored `key` to delete file from R2 when needed

## Data Flow Summary

```
Audio File → Better Upload → R2 Storage
                ↓
            Response { key, signedUrl }
                ↓
            Frontend extracts key & URL
                ↓
            POST /song { audioUrl, audioKey }
                ↓
            Database { url, key }
```
