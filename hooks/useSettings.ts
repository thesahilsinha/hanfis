'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useSettings() {
  const [settings, setSettings] = useState<any>(null)
  useEffect(() => {
    createClient().from('site_settings').select('*').single()
      .then(({ data }) => { if (data) setSettings(data) })
  }, [])
  return settings
}