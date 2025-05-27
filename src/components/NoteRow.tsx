// components/NoteRow.tsx
import React from 'react';
import StepCell from './StepCell';
import { Note } from '../models';

type Props = {
  note: Note;
  patternLength: number;
  onToggleStep: (idx: number) => void;
  onUpdateNote: (fields: Partial<Note>) => void;
};

export default function NoteRow({
  note,
  patternLength,
  onToggleStep,
  onUpdateNote
}: Props) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-12">{note.note}</div>
      <input
        type="range"
        min={1} max={patternLength}
        value={note.length}
        onChange={e => onUpdateNote({ length: +e.target.value })}
      />
      <input
        type="range"
        min={1} max={127}
        value={note.velocity}
        onChange={e => onUpdateNote({ velocity: +e.target.value })}
      />
      <div className="flex">
        {note.steps.map((s, i) => (
          <StepCell
            key={i}
            active={s.active}
            onClick={() => onToggleStep(i)}
          />
        ))}
      </div>
    </div>
  );
}
