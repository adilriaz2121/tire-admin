import { useState, useEffect } from "react";

// Define the type for a single item (used in AutoComplete options)
interface Item {
  label: string;
  value: string;
}

// Define the return type for the fetching function
type FetchFunctionResponse = Array<Item>;

// The fetch function type expects to return a Promise with FetchFunctionResponse
type FetchFunction = (query?: string) => Promise<FetchFunctionResponse>;

// Define the return type of the custom hook
interface UseFetchItemsReturn {
  data: Item[];
  loading: boolean;
  error: Error | null;
  fetchData: (query?: string) => Promise<Item[]>;
}

// Custom hook for fetching items with an optional query parameter
const useFetchItems = (
  initialFetchFunction: FetchFunction
): UseFetchItemsReturn => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (query?: string): Promise<Item[]> => {
    setLoading(true);
    try {
      const items = await initialFetchFunction(query);
      setData(items);
      return items; // Now fetchData returns the fetched items
    } catch (err) {
      setError(err as Error);
      throw err; // If needed, re-throw the error so the caller can handle it
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};

export default useFetchItems;
