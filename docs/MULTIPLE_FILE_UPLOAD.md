# Multiple File Upload Implementation

## Overview

The application now supports uploading **multiple audio files at once** using Better Upload's `multipleFiles` feature. Users can select up to 10 MP3 files simultaneously, and each file will be uploaded, processed, and converted into a song entry in the database.

## Changes Made

### Backend (`/rhythm_taste/src/plugin/betterUploadPlugin.ts`)

**Added multiple file upload support:**

```typescript
audio: route({
  multipleFiles: true,        // Enable multiple file uploads
  maxFiles: 10,               // Maximum 10 files at once (default is 3)
  fileTypes: ["audio/mpeg"],
  maxFileSize: 100 * 1024 * 1024,
  onAfterSignedUrl: async ({ files }) => {  // Note: 'files' (plural) instead of 'file'
    // Create Audio records for all uploaded files
    await Promise.all(
      files.map(async (file) => {
        const key = file.objectInfo.key;
        const publicUrl = `${process.env.AUDIO_R2_PUBLIC_URL}/${key}`;

        await prisma.audio.create({
          data: {
            key: key,
            url: publicUrl,
          },
        });
      })
    );
  },
}),
```

**Key changes:**

1. ✅ Added `multipleFiles: true` to enable multiple file uploads
2. ✅ Set `maxFiles: 10` to allow up to 10 files per upload (default is 3)
3. ✅ Changed callback parameter from `{ file }` to `{ files }` (array)
4. ✅ Used `Promise.all()` to create Audio records for all files in parallel

### Frontend - Uploader Component (`/rhythm-taste-fe/src/components/Uploader.tsx`)

**Switched from single to multiple file upload hook:**

```typescript
// Before: useUploadFile (single file)
const { control } = useUploadFile({...});

// After: useUploadFiles (multiple files)
const { control } = useUploadFiles({...});
```

**Updated callback to handle multiple files:**

```typescript
onUploadComplete: async ({ files }) => {  // 'files' array instead of 'file'
  try {
    // Process each uploaded file
    for (const fileInfo of files) {
      const key = fileInfo.objectInfo.key;

      // Fetch audio record
      const audio = await apiService.audio.getAudioByKey(key);

      // Parse metadata
      const metadata = await parseBlob(fileInfo.raw);

      // Create song
      await apiService.song.createSong({
        title: metadata.common.title || fileInfo.name,
        duration: metadata.format.duration,
        artist: metadata.common.artist,
        album: metadata.common.album,
        albumCover: coverBase64,
        audioId: audio.id,
      });

      console.log(`Song "${title}" created successfully`);
    }

    // Refresh the songs list
    queryClient.invalidateQueries({ queryKey: [keys.songs] });
  } catch (error) {
    console.error("Failed to create song:", error);
  }
},
```

### Frontend - Upload Button (`/rhythm-taste-fe/src/components/upload-button.tsx`)

**Updated to support multiple files:**

```typescript
type UploadButtonProps = {
  control: UploadHookControl<true>;  // Changed from <false> to <true>
  // ... other props
};

// Added 'multiple' attribute to input
<input
  type="file"
  accept={accept}
  multiple  // ← Added this
  onChange={(e) => {
    if (e.target.files && e.target.files.length > 0 && !isPending) {
      upload(e.target.files, { metadata });  // Pass FileList instead of single File
    }
  }}
/>
```

## How It Works

### Upload Flow

1. **User Selection**
   - User clicks the upload button
   - File picker opens with multiple selection enabled
   - User selects 1-10 MP3 files (Ctrl+Click or Cmd+Click)

2. **Client-Side Upload**
   - `useUploadFiles` hook sends all files to `/api/upload`
   - Better Upload generates pre-signed URLs for each file
   - Files are uploaded to Cloudflare R2 in parallel

3. **Server-Side Processing**
   - `onAfterSignedUrl` callback is triggered with all files
   - Audio records are created in the database for each file
   - Each record contains the R2 key and public URL

4. **Client-Side Completion**
   - `onUploadComplete` callback receives all uploaded files
   - For each file:
     - Fetch the Audio record using the file key
     - Extract metadata (title, artist, album, duration, cover art)
     - Create a Song record linked to the Audio record
   - Songs list is automatically refreshed

5. **UI Update**
   - Query invalidation triggers a refetch
   - New songs appear in the dashboard

## Configuration

### Maximum Files

You can adjust the maximum number of files allowed per upload:

```typescript
// In betterUploadPlugin.ts
audio: route({
  multipleFiles: true,
  maxFiles: 20,  // Change this value (default is 3)
  // ...
}),
```

### File Size Limit

Current limit is 100MB per file:

```typescript
maxFileSize: 100 * 1024 * 1024,  // 100MB
```

### Supported Formats

Currently only MP3 files are supported:

```typescript
fileTypes: ["audio/mpeg"],
```

To add more formats:

```typescript
fileTypes: ["audio/mpeg", "audio/wav", "audio/ogg"],
```

## User Experience

### Selection

- **Windows/Linux**: Hold `Ctrl` and click multiple files
- **macOS**: Hold `Cmd` and click multiple files
- **All platforms**: Click and drag to select a range

### Processing

- All files are uploaded simultaneously
- Each file is processed independently
- If one file fails, others continue processing
- Progress is shown during upload

### Feedback

- Console logs show each song creation
- Songs list updates automatically after all uploads complete
- Errors are logged to console for debugging

## Error Handling

### Individual File Failures

If a single file fails during processing, the loop continues with `continue`:

```typescript
if (!key) {
  console.error("File key not found in upload response");
  continue; // Skip this file, process others
}
```

### Complete Upload Failure

If the entire upload fails (e.g., network error), the error is caught and logged:

```typescript
catch (error) {
  console.error("Failed to create song:", error);
}
```

## Performance Considerations

### Parallel Processing

- **Upload**: Files are uploaded to R2 in parallel by Better Upload
- **Database**: Audio records are created in parallel using `Promise.all()`
- **Song Creation**: Songs are created sequentially to avoid race conditions

### Memory Usage

- Large batches (10 files × 100MB = 1GB) may impact browser performance
- Consider reducing `maxFiles` or `maxFileSize` for better UX

## Testing

### Test Cases

1. **Single File**: Upload 1 file to ensure backward compatibility
2. **Multiple Files**: Upload 3-5 files to test normal usage
3. **Maximum Files**: Upload 10 files to test the limit
4. **Mixed Success**: Test with some invalid files to ensure error handling
5. **Large Files**: Upload files close to 100MB limit

### Test Procedure

```bash
# 1. Start the backend
cd rhythm_taste
bun run dev

# 2. Start the frontend
cd rhythm-taste-fe
npm run dev

# 3. Navigate to Dashboard
# 4. Click upload button
# 5. Select multiple MP3 files
# 6. Verify all songs are created
# 7. Check browser console for logs
```

## Troubleshooting

### Files Not Uploading

- Check browser console for errors
- Verify backend is running
- Check CORS configuration on R2 bucket
- Ensure file types match `fileTypes` configuration

### Some Songs Not Created

- Check console logs for specific file errors
- Verify metadata can be extracted from the file
- Ensure Audio records are created in database

### Slow Performance

- Reduce `maxFiles` limit
- Reduce `maxFileSize` limit
- Check network speed
- Monitor server resources

## Future Enhancements

- [ ] Add progress bar for each file
- [ ] Show upload queue with individual file status
- [ ] Add drag-and-drop support for multiple files
- [ ] Implement batch upload summary notification
- [ ] Add ability to cancel individual file uploads
- [ ] Support for additional audio formats (WAV, FLAC, etc.)
- [ ] Parallel song creation for better performance
- [ ] Retry failed uploads automatically

## References

- [Better Upload Documentation](https://better-upload.com/docs)
- [Better Upload Multiple Files Hook](https://better-upload.com/docs/hooks-multiple)
- [Better Upload Multiple Files Route](https://better-upload.com/docs/routes-multiple)
