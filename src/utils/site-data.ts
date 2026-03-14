async function clearIndexedDB(): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window))
    return

  const indexedDBApi = window.indexedDB
  const databases = typeof indexedDBApi.databases === 'function'
    ? await indexedDBApi.databases()
    : []

  await Promise.allSettled(
    databases
      .map(database => database.name)
      .filter((name): name is string => !!name)
      .map(name => new Promise<void>((resolve) => {
        const request = indexedDBApi.deleteDatabase(name)
        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
        request.onblocked = () => resolve()
      })),
  )
}

async function clearCacheStorage(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window))
    return

  const cacheKeys = await window.caches.keys()
  await Promise.allSettled(cacheKeys.map(key => window.caches.delete(key)))
}

async function clearServiceWorkers(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator))
    return

  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.allSettled(registrations.map(registration => registration.unregister()))
}

export async function clearSiteData(): Promise<void> {
  if (typeof window === 'undefined')
    return

  window.localStorage.clear()
  window.sessionStorage.clear()

  await Promise.allSettled([
    clearIndexedDB(),
    clearCacheStorage(),
    clearServiceWorkers(),
  ])
}

export async function clearSiteDataAndReload(): Promise<void> {
  await clearSiteData()
  window.location.reload()
}
