import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export async function uploadImage(blob: Blob, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('fotos')
    .upload(fileName, blob, { upsert: true, contentType: blob.type || 'image/jpeg', cacheControl: '31536000' })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('fotos')
    .getPublicUrl(data.path)

  return publicUrl
}
