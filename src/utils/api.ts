import urlJoin from 'url-join';

import { Stock } from '../types';
import { useFetchData } from './use-fetch-data';

export function useFetchStocks(): { isLoading: boolean; stocks?: Array<Stock>; error: Error } {
  const { isLoading, error, data } = useFetchData<Array<Stock>>(
    urlJoin(process.env.REACT_APP_API_HOST, 'api/stocks'),
  );
  return {
    isLoading,
    error,
    stocks: data,
  };
}
