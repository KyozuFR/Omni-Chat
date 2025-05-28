import type { Ref } from 'vue'
import { ref } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  headers?: Record<string, string>
  method?: RequestInit['method']
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: (payload?: any) => Promise<void>
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const baseHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Ajouter automatiquement l'en-tête X-Service pour les requêtes POST
  if (options.method === 'POST') {
    baseHeaders['X-Service'] = 'website'
  }

  const execute = async (payload?: any): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const fetchOptions: RequestInit = {
        method: options.method ?? 'GET',
        headers: baseHeaders,
      }
      if (payload !== undefined) {
        fetchOptions.body = JSON.stringify(payload)
      }
      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Une erreur inconnue est survenue')
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  if (options.immediate !== false) {
    execute()
  }

  return {
    data,
    error,
    loading,
    execute,
  }
}

export default useFetch
