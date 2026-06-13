import { supabase } from './supabase'

const CONFIG_ID = 'main'

export async function savePageData(data: any): Promise<void> {
  const { error } = await supabase
    .from('page_config')
    .upsert({ id: CONFIG_ID, data, updated_at: new Date().toISOString() })

  if (error) throw error
}

export async function loadPageData(): Promise<any> {
  const { data, error } = await supabase
    .from('page_config')
    .select('data')
    .eq('id', CONFIG_ID)
    .single()

  if (error || !data) return null
  return data.data
}
