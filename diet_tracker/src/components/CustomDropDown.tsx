import { ChevronDown, Coffee, MoonStar, Sandwich, Soup } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomDropdown = ({ value, onChange, placeholder }: {
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const options = [
        { value: 'Breakfast', label: 'Breakfast' },
        { value: 'Lunch', label: 'Lunch' },
        { value: 'Dinner', label: 'Dinner' },
        { value: 'Mid-snacks', label: 'Mid-snacks' },
    ];

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const getMealIcon = (mealName: string) => {
        switch (mealName) {
            case 'Breakfast': return <Coffee size={20} className="text-[#FFA500]" />;
            case 'Lunch': return <Soup size={20} className="text-pink-500" />;
            case 'Dinner': return <MoonStar size={20} className="text-purple-500" />;
            case 'Mid-snacks': return <Sandwich size={20} className="text-cyan-500" />;
            default: return null;
        }
    };

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="w-full flex justify-between items-center bg-[#121620] text-gray-200 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex items-center gap-2">
                    {value ? getMealIcon(value) : null}
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-[#1a1e2a] rounded-xl border border-gray-700 shadow-xl overflow-hidden animate-fade-in-down">
                    {options.map(option => (
                        <li
                            key={option.value}
                            className="flex items-center gap-2 px-4 py-3 text-gray-200 cursor-pointer hover:bg-pink-500/20 transition-colors"
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {getMealIcon(option.value)}
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;