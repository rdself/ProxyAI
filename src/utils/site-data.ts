const LOCAL_STORAGE_KEYS_TO_CLEAR = [
  'SECRET_TOKEN',
  'gptConfigStore',
  'gptServerStore',
  'webdav_config',
  '_t_apikey',
  '_t_baseurl',
] as const

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

  LOCAL_STORAGE_KEYS_TO_CLEAR.forEach(key => window.localStorage.removeItem(key))
  window.sessionStorage.clear()

  await Promise.allSettled([
    clearCacheStorage(),
    clearServiceWorkers(),
  ])
}

export async function clearSiteDataAndReload(): Promise<void> {
  await clearSiteData()
  window.location.reload()
}
