import { useApiInterceptors } from '~/composables/api/apiInterceptors';

export const useServerApi = () => {
  const nuxtApp = useNuxtApp();

  const $serverApi = nuxtApp.$serverApi as (
    url: string,
    opts: RequestInit
  ) => Promise<unknown>;

  const $ServerApiInterceptors = nuxtApp.$ServerApiInterceptors as RequestInit;

  useApiInterceptors();

  async function serverRequest<T>(
    url: string,
    params: RequestInit = {}
  ): Promise<T> {
    const merged = { ...params, ...$ServerApiInterceptors };
    const raw = await $serverApi(url, merged);
    return raw as T;
  }

  return { serverRequest, $serverApi };
};



// import {useUserStore} from "#build/imports";

export const useApiInterceptors = () => {
    const {$ServerApiInterceptors} = useNuxtApp();
    // const userStore = useUserStore();
    // const $q = useQuasar()

    // @ts-ignore
    $ServerApiInterceptors.onResponseError = async ({request, response, options }) => {
        // if(userStore?.accessToken) {
        //     $q.notify({
        //         type: 'negative',
        //         position: 'top-right',
        //         progress: true,
        //         actions: [{icon: 'close', color: 'white'}],
        //         message: response._data.message || 'ERROR',
        //         timeout: 10000,
        //     })
        //
        //     if (response.status == '401') {
        //         await userStore.logout()
        //     }
        // }
    }

    // @ts-ignore
    $ServerApiInterceptors.onRequest = async ({ request, options }) => {
        if (!('headers' in options)) {
            options.headers = new Headers(options.headers);
        }
        options.headers.set('X-CSRF', '1');

        // Add Authorization header if the user is authenticated
        // if (userStore?.accessToken) {
        //     options.headers['Authorization'] = 'Bearer ' + userStore.accessToken;
        // }

        // if(userStore?.accessToken) {
        //     if(!('headers' in options)) {
        //         options.headers = {};
        //     }
        //     options.headers['Authorization'] = 'Bearer ' + userStore?.accessToken
        //     options.headers['x-device-id'] = userStore?.deviceId
        //     $q.loading.show()
        // }
    }

    // @ts-ignore
    $ServerApiInterceptors.onResponse = async ({response, options}) => {
        // if(userStore?.accessToken) {
        //     $q.loading.hide()
        //     if(response.ok && ['post', 'patch', 'put', 'delete'].includes(options.method.toLowerCase())) {
        //         $q.notify({
        //             type: 'positive',
        //             position: 'top-right',
        //             progress: true,
        //             actions: [{icon: 'close', color: 'white'}],
        //             message: 'SUCCESS',
        //             timeout: 3000,
        //         })
        //     }
        // }
    }

    // @ts-ignore
    $ServerApiInterceptors.onError = async (err) => {
        // if(userStore?.accessToken) {
        //     $q.notify({
        //         type: 'negative',
        //         position: 'top-right',
        //         progress: true,
        //         actions: [{icon: 'close', color: 'white'}],
        //         message: err?.message || 'ERROR',
        //         timeout: 10000,
        //     })
        //     $q.loading.hide()
        // }

    }

}

