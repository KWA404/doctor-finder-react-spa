
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Doctor } from "../types/doctor";
import { debounce } from "../utils/helpers";

interface SearchBarProps {
  doctors: Doctor[];
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ doctors, searchTerm, onSearchChange }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      const matchedDoctors = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);

      setSuggestions(matchedDoctors);
    }, 300),
    [doctors]
  );

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
    onSearchChange(name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchChange(inputValue);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mb-6">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500"
          placeholder="Search for doctors..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          data-testid="autocomplete-input"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
        >
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(doctor.name)}
              data-testid="suggestion-item"
            >
              {doctor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
