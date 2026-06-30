import { supabase } from './supabase'

const CONFIG_ID = 'main'
const CACHE_KEY = 'pageDataCache'

export async function savePageData(data: any): Promise<void> {
  const { error } = await supabase
    .from('page_config')
    .upsert({ id: CONFIG_ID, data, updated_at: new Date().toISOString() })

  if (error) throw error
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

export function getCachedPageData(): any {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function loadPageData(): Promise<any> {
  const { data, error } = await supabase
    .from('page_config')
    .select('data')
    .eq('id', CONFIG_ID)
    .single()

  if (error || !data) return null
  localStorage.setItem(CACHE_KEY, JSON.stringify(data.data))
  return data.data
}
