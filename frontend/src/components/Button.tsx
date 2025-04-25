import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;  
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
    <button
      className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
      {...props}
    >
      {children}
    </button>
);
  
export default Button;
