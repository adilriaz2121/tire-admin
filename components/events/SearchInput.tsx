import { Input } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface SearchInputProps {
    name?: string; // Optional placeholder text
    debounceTime?: number; // Optional debounce delay (in ms)
}

const SearchInput: React.FC<SearchInputProps> = ({
    name = "Events", // Default placeholder name
    debounceTime = 500, // Default debounce time
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [inputValue, setInputValue] = useState<string>("");

    // Initialize input with 'search' query parameter from URL
    useEffect(() => {
        const queryValue = searchParams.get("search"); // Get 'search' param from URL
        setInputValue(queryValue || ""); // Initialize input value
    }, [searchParams]);

    // Handle input changes with debouncing and URL updates
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
        }, debounceTime);

        return () => {
            clearTimeout(handler); // Clear timeout if the input changes again
        };
    }, [inputValue, debounceTime, searchParams, router]);

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
