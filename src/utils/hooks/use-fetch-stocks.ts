import urlJoin from 'url-join';

import { StockFromServer } from '../../types';
import { useFetchData } from './use-fetch-data';

export function useFetchStocks(): {
  isLoading: boolean;
  stocks?: Array<StockFromServer>;
  error: Error;
} {
  const { isLoading, error, data } = useFetchData<Array<StockFromServer>>(
    urlJoin(process.env.REACT_APP_API_HOST, 'api/stocks'),
  );
  return {
    isLoading,
    error,
    stocks: data,
  };
}
