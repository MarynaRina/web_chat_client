import { useRef, useEffect } from "react";

interface CodeInputProps {
  value: string;
  onChange: (val: string) => void;
  onComplete: (code: string) => void; // Додаємо функцію для автоматичної перевірки
  isLoading?: boolean; // Додаємо індикатор завантаження
}

const CodeInput = ({
  value,
  onChange,
  onComplete,
  isLoading = false,
}: CodeInputProps) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (value.length < 6) {
      inputs.current[value.length]?.focus();
    } else if (value.length === 6) {
      // Автоматично викликаємо перевірку, коли введено всі 6 цифр
      onComplete(value);
    }
  }, [value, onComplete]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newCode = value.split("");
    newCode[index] = val;
    const updated = newCode.join("").slice(0, 6);
    onChange(updated);

    // Автоматично переходимо до наступного поля після введення цифри
    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const updated = value.split("");
        updated[index] = "";
        onChange(updated.join(""));
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-3 mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 aspect-square bg-gradient-to-r from-[#94BCB7] to-[#A8A6FF] p-[2px] rounded-xl"
          >
            <div className="w-full h-full bg-bgBase flex items-center justify-center rounded-[8px]">
              <input
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={value[i] || ""}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={isLoading}
                className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent w-full h-full text-center text-2xl bg-transparent outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Індикатор завантаження */}
      {isLoading && (
        <div className="mt-4 text-sm text-blue-500">Verifying code...</div>
      )}
    </div>
  );
};

export default CodeInput;
