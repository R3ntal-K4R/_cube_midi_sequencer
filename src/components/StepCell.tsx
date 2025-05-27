// components/StepCell.tsx
import React from 'react';

type Props = { active: boolean; onClick: () => void };
export default function StepCell({ active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`w-6 h-6 mx-0.5 cursor-pointer ${
        active ? 'bg-blue-500' : 'bg-gray-200'
      }`}
    />
  );
}
