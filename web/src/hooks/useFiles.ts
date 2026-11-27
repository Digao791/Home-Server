import useSWR from 'swr';

import { getFiles } from '../api/files';

export function useFiles(path: string) {

    return useSWR(
        ['/api/files', path],
        () => getFiles(path),
        {
            revalidateOnFocus: true,
            errorRetryCount: 2
        }
    );
}