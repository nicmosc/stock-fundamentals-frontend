import { useEffect, useState } from 'react';

interface State<T> {
  isLoading: boolean;
  data?: T;
  error?: any;
}

export function useFetchData<T>(
  url: string,
  { transform, waitFor = true, shouldExecute = true }: any = {},
) {
  // Use single state to avoid unncessary re-renders
  const [state, setState] = useState({
    isLoading: true,
    data: undefined,
    error: undefined,
  } as State<T>);
  const updateState = (newState: State<T>) => setState((state) => ({ ...state, ...newState }));

  useEffect(() => {
    const fetchData = async () => {
      updateState({ isLoading: true });
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        updateState({ isLoading: false, data: transform != null ? transform(data) : data });
      } else {
        updateState({ isLoading: false, error: { status: response.status } });
      }
    };

    if (waitFor && shouldExecute) {
      fetchData();
    }
  }, [url, waitFor]);

  return state;
}
