export function setWithTTL(
    key: string,
    value: any,
    ttl: number = MINUTE,
) {
    const now = new Date()

    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }

    localStorage.setItem(key, JSON.stringify(item))
}

export function getWithTTL<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }

    return item.value as T
}

export const MINUTE = 1000 * 60