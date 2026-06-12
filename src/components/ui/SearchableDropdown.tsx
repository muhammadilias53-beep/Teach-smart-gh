import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  error?: string;
  disabled?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  triggerClassName,
  error,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className={cn("relative w-full z-20", className)}>
      <div
        id="searchable-dropdown-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          triggerClassName || "input-field flex items-center justify-between cursor-pointer select-none p-4",
          isOpen && !triggerClassName && "border-navy-light ring-4 ring-navy-light/5",
          error && "border-red-400 ring-4 ring-red-50",
          disabled && "opacity-50 cursor-not-allowed bg-slate-100"
        )}
      >
        <span className={cn(value ? "font-bold" : "text-slate-400", !triggerClassName && value && "text-slate-700")}>
          {value || placeholder}
        </span>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-200", isOpen && "transform rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-fadeIn max-h-72 flex flex-col">
          <div className="p-3 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 font-medium py-1"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                id="searchable-dropdown-clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="overflow-y-auto py-1 custom-scrollbar flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  id={`searchable-dropdown-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 font-medium cursor-pointer transition-colors",
                    value === option && "bg-navy-light/5 text-navy-deep font-bold"
                  )}
                >
                  <span>{option}</span>
                  {value === option && <Check className="w-4 h-4 text-emerald-deep" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-slate-400 text-center font-medium">
                No matching subjects found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
