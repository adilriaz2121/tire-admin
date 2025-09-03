import React, { useState, Key, useTransition, useEffect, useRef } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface AutoCompleteProps {
  data: { label: string; value: string }[]; // Initial data to populate the autocomplete
  label: string; // Label for the autocomplete input
  placeholder: string; // Placeholder for the input field
  fetchData: (query: string) => Promise<{ label: string; value: string }[]>; // Function to fetch data dynamically
  onSelect: (type: string, value: Key | null) => void; // Callback for when an item is selected
  className?: string; // Optional class for styling
  name: string;
  isLoading: boolean;
  defaultValue: string;
  errorMessage?: string;
}

export default function AutoComplete({
  data,
  label,
  placeholder,
  fetchData,
  errorMessage,
  onSelect,
  name,
  isLoading,
  defaultValue,
  className = "",
}: AutoCompleteProps) {
  const [items, setItems] = useState(data); // Manage autocomplete items
  const [isPending, startTransition] = useTransition(); // Manage transition state
  const [debouncedValue, setDebouncedValue] = useState<string | null>(
    data.find((x) => x.value === defaultValue)?.label || null
  ); // Store debounced input value
  const [inputValue, setInputValue] = useState<string | null>(
    data.find((x) => x.value === defaultValue)?.label || null
  ); // Store actual input value

  const fetchCache = useRef<{
    [key: string]: { label: string; value: string }[];
  }>({}); // Cache to store fetched results

  // Debouncing logic: Update debounced value after 500ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 750);

    // Cleanup timeout if the user types again within 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Fetch data whenever debounced value changes and is non-empty
  useEffect(() => {
    if (debouncedValue !== null) {
      // Check cache first before making a new fetch request
      if (fetchCache.current[debouncedValue]) {
        setItems(fetchCache.current[debouncedValue]);
      } else {
        startTransition(() => {
          const fetch = async () => {
            try {
              const fetchedData = await fetchData(debouncedValue); // Fetch new data based on user input
              fetchCache.current[debouncedValue] = fetchedData; // Cache the result
              setItems(fetchedData); // Update items dynamically
            } catch (error) {
              console.error("Error fetching data:", error); // Handle fetch error
            }
          };
          fetch();
        });
      }
    }
  }, [debouncedValue, fetchData, data]);

  // Handle input change and update the inputValue state
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <Autocomplete
      // Filter to ensure valid items
      defaultItems={items.filter(
        (item) => item.label !== "" && item.value !== ""
      )}
      name={name}
      defaultSelectedKey={defaultValue}
      label={label}
      disabled={isPending}
      isLoading={isLoading}
      errorMessage={errorMessage}
      variant="bordered"
      placeholder={placeholder}
      className={className}
      onSelectionChange={(value) => onSelect(name, value)} // Trigger onSelect when an item is selected
      onInputChange={handleInputChange} // Trigger fetch when input changes
    >
      {(item) => (
        <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
}
