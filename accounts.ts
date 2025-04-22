import { useServerApi } from '~/composables/api';
import { CSRF, CSRF_HEADERS } from '~/constants/apiHeader';
import type { Accounts, OrderPayload } from '~/types/cards-accounts';

export async function fetchAccounts(): Promise<Accounts> {
  const { serverRequest } = useServerApi();
  return serverRequest<Accounts>('/privateapi/accounts', {
    method: 'GET',
    headers: CSRF_HEADERS,
    credentials: 'include',
  });
}

export async function orderAccounts(payload: OrderPayload[]): Promise<Accounts> {
  const { serverRequest } = useServerApi();
  const headers = new Headers(CSRF);
  headers.set('Content-Type', 'application/json');
  return serverRequest<Accounts>('/privateapi/accounts/sorting', {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });
}
