// components/PatternControls.tsx
import React from 'react';
import { Pattern } from '../models';

type Props = {
  pattern: Pattern;
  onUpdate: (upd: Partial<Pattern>) => void;
  onSave(): void;
  onLoad(p: Pattern): void;
  onPlay(): void;
  onStop(): void;
};

export default function PatternControls({
  pattern,
  onUpdate,
  onSave,
  onLoad,
  onPlay,
  onStop
}: Props) {
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={pattern.name}
        onChange={e => onUpdate({ name: e.target.value })}
        placeholder="Pattern name"
      />
      <input
        type="number"
        value={pattern.tempo}
        onChange={e => onUpdate({ tempo: +e.target.value })}
      />
      <input
        type="number"
        value={pattern.channel}
        onChange={e => onUpdate({ channel: +e.target.value })}
      />
      <button onClick={onPlay}>▶️ Play</button>
      <button onClick={onStop}>⏹ Stop</button>
      <button onClick={onSave}>💾 Save</button>
      <button onClick={() => {
        const all = JSON.parse(localStorage.getItem('patterns')||'[]');
        // for simplicity load first
        if (all[0]) onLoad(all[0]);
      }}>📂 Load</button>
    </div>
  );
}
