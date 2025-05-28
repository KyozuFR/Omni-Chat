import type { Ref } from 'vue'
import { ref } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  headers?: Record<string, string>
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const baseHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const execute = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        headers: baseHeaders,
      })

      if (!response.ok) {
        console.error(`Erreur HTTP: ${response.status} ${response.statusText}`)
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
