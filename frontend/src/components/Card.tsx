import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

export default Card;
