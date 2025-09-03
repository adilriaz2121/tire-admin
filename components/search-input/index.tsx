import { Input } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface SearchInputProps {
  name?: string; // Optional placeholder text
  debounceTime?: number; // Optional debounce delay (in ms)
  callback?: (value: string) => void; // Function to execute after debouncing
}

const SearchInput: React.FC<SearchInputProps> = ({
  name = "Events", // Default placeholder name
  debounceTime = 500, // Default debounce time
  callback, // Optional callback function
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");

  // Initialize input with 'search' query parameter from URL
  useEffect(() => {
    const queryValue = searchParams.get("search"); // Get 'search' param from URL
    setInputValue(queryValue || ""); // Initialize input value
  }, [searchParams]);

  // Handle input changes with debouncing, URL updates, and callback execution
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (inputValue.trim()) {
        params.set("search", inputValue); // Update or add 'search' param
      } else {
        params.delete("search"); // Remove 'search' param if input is cleared
      }

      router.push(`?${params.toString()}`); // Update URL
      router.refresh(); // Refresh the page (if necessary for your app)

      if (callback) {
        callback(inputValue); // Execute the callback function
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler); // Clear timeout if the input changes again
    };
  }, [inputValue, debounceTime, searchParams, router, callback]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Input
      classNames={{
        input: "w-full",
        mainWrapper: "w-full",
      }}
      name={name}
      placeholder={`Search ${name}`}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

export default SearchInput;
