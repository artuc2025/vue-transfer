import { ref, computed } from 'vue';
import { useAsync } from '~/composables/useAsync';

interface UseResourceOptions<
  ListRes,
  ListItem,
  DetailRes = ListItem,
  DetailItem = DetailRes,
  ListArgs extends any[] = [],
  DetailArgs extends any[] = []
> {
  fetchList: (...args: ListArgs) => Promise<ListRes>;
  extractList?: (res: ListRes) => ListItem[];

  fetchDetail?: (...args: DetailArgs) => Promise<DetailRes>;
  extractDetail?: (res: DetailRes) => DetailItem;
}

export function useResource<
  ListRes,
  ListItem,
  DetailRes = ListItem,
  DetailItem = DetailRes,
  ListArgs extends any[] = [],
  DetailArgs extends any[] = []
>(
  options: UseResourceOptions<
    ListRes,
    ListItem,
    DetailRes,
    DetailItem,
    ListArgs,
    DetailArgs
  >
) {
  const {
    fetchList,
    extractList,
    fetchDetail,
    extractDetail
  } = options;

  const items = ref<ListItem[]>([]);
  const listReq = useAsync<ListRes, ListArgs>(fetchList);
  const loading = computed(() => listReq.loading.value);
  const error = computed(() => listReq.error.value);

  async function loadItems(...args: ListArgs) {
    const res = await listReq.execute(...args);
    items.value = extractList ? extractList(res) : (res as unknown as ListItem[]);
  }

  const detail = fetchDetail ? ref<DetailItem | null>(null) : undefined;
  const detailReq = fetchDetail
    ? useAsync<DetailRes, DetailArgs>(fetchDetail)
    : undefined;

  const detailLoading = detailReq
    ? computed(() => detailReq.loading.value)
    : undefined;

  const detailError = detailReq
    ? computed(() => detailReq.error.value)
    : undefined;

  async function loadDetail(...args: DetailArgs) {
    if (!detailReq || !detail) return;
    const res = await detailReq.execute(...args);
    detail.value = extractDetail ? extractDetail(res) : (res as unknown as DetailItem);
  }

  return {
    items,
    loading,
    error,
    loadItems,

    detail,
    detailLoading,
    detailError,
    loadDetail
  };
}
