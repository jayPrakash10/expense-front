import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type Props = {
  color?: string;
  className?: string;
  onChange?: (color: string) => void;
  debounceTime?: number;
};

const ColorPicker = ({
  color,
  className,
  onChange,
  debounceTime = 1000,
}: Props) => {
  const [pickColor, setColor] = useState("#f0f0f0");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sync with external color prop
  useEffect(() => {
    setColor(color || "#ff0000");
  }, [color]);

  // Debounced change handler
  const handleColorChange = useCallback(
    (newColor: string) => {
      setColor(newColor);

      // Clear any pending debounce
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if (onChange) {
          onChange(newColor);
        }
      }, debounceTime);

      // Cleanup function to clear timeout if component unmounts
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    },
    [onChange, debounceTime]
  );

  return (
    <button
      type="button"
      className={cn(
        "aspect-square rounded-full border relative overflow-hidden h-4 cursor-pointer",
        className
      )}
      style={{ backgroundColor: pickColor }}
      aria-label="Choose color"
    >
      <Input
        type="color"
        className="w-full h-full p-0 border-0 rounded-full opacity-0 cursor-pointer"
        value={pickColor}
        onChange={(e) => handleColorChange(e.target.value)}
        aria-label="Color picker"
      />
    </button>
  );
};

export default ColorPicker;
