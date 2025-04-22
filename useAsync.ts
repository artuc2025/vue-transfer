import { ref } from 'vue';

export function useAsync<T, A extends any[] = any[]>(
  fn: (...args: A) => Promise<T>
) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref<boolean>(false);

  async function execute(...args: A): Promise<T> {
    loading.value = true;
    error.value = null;
    try {
      const result = await fn(...args);
      data.value = result;
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err;
      } else {
        error.value = new Error(String(err));
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, execute };
}
