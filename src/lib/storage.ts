// Safe localStorage and sessionStorage wrappers to prevent SecurityErrors in sandboxed iframes

class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const createSafeStorage = (type: 'local' | 'session'): Storage => {
  const isSupported = (): boolean => {
    try {
      const storage = type === 'local' ? window.localStorage : window.sessionStorage;
      if (!storage) return false;
      
      const testKey = '__test_storage_support__';
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  if (isSupported()) {
    const originalStorage = type === 'local' ? window.localStorage : window.sessionStorage;
    return {
      get length(): number {
        try {
          return originalStorage.length;
        } catch {
          return 0;
        }
      },
      clear(): void {
        try {
          originalStorage.clear();
        } catch {}
      },
      getItem(key: string): string | null {
        try {
          return originalStorage.getItem(key);
        } catch {
          return null;
        }
      },
      key(index: number): string | null {
        try {
          return originalStorage.key(index);
        } catch {
          return null;
        }
      },
      removeItem(key: string): void {
        try {
          originalStorage.removeItem(key);
        } catch {}
      },
      setItem(key: string, value: string): void {
        try {
          originalStorage.setItem(key, value);
        } catch {}
      }
    };
  }

  return new InMemoryStorage();
};

export const safeLocalStorage = createSafeStorage('local');
export const safeSessionStorage = createSafeStorage('session');
