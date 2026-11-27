import useSWR from 'swr';

import { getSystemInfo } from '../api/system';

export function useSystemInfo() {

    return useSWR(
        '/api/system/info',
        getSystemInfo,
        {
            refreshInterval: 5000,
            revalidateOnFocus: true,
            refreshWhenHidden: false,
            errorRetryCount: 3
        }
    );
}