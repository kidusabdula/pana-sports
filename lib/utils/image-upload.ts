// lib/utils/image-upload.ts
import { createStorageClient } from '@/lib/supabase/server'

export async function uploadImage(file: File, bucket: string, folder: string = '') {
  // Use the storage client with service role key to bypass RLS
  const supabase = await createStorageClient()
  
  // Generate a unique file name to avoid collisions
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder ? `${folder}/` : ''}${Date.now()}.${fileExt}`
  
  try {
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) {
      console.error('Supabase storage error:', error)
      throw error
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return {
      path: data.path,
      publicUrl
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}