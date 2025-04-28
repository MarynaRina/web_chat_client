import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <div className="flex justify-center items-center">
      <button
        type={type}
        onClick={onClick}
        className={`bg-edit hover:bg-gradient-end text-bgBase px-6 py-2 rounded-full font-medium ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default PrimaryButton;