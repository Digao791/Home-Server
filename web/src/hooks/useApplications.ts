import useSWR from 'swr';

import { getApplications } from '../api/applications';

export function useApplications() {

    return useSWR(
        '/api/applications',
        getApplications,
        {
            revalidateOnFocus: true,
            errorRetryCount: 3
        }
    );
}