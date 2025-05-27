// src/components/SequencerGrid.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { Pattern } from '../models';
import type { Output } from 'webmidi';
import { WebMidi } from 'webmidi';
import { Sequencer } from '../sequencer';

interface SequencerGridProps {
  pattern: Pattern;
  onPatternChange?: (updated: Pattern) => void;
}

export default function SequencerGrid({ pattern, onPatternChange }: SequencerGridProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const seqRef = useRef<Sequencer>();
  const [midiReady, setMidiReady] = useState(false);

  // Initialize MIDI output & sequencer
  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        const out: Output | undefined = WebMidi.outputs[0];
        if (!out) throw new Error('No MIDI output found');
        seqRef.current = new Sequencer(pattern, out);
        seqRef.current.onStep = setCurrentStep;
        setMidiReady(true);
      })
      .catch(err => console.error('MIDI init failed', err));
  }, [pattern]);

  // Update sequencer when pattern changes
  useEffect(() => {
    if (seqRef.current) seqRef.current.setPattern(pattern);
  }, [pattern]);

  const handleToggle = (noteId: string, stepIdx: number) => {
    const updatedPattern = {
      ...pattern,
      notes: pattern.notes.map(n =>
        n.id === noteId
          ? {
              ...n,
              steps: n.steps.map((s, idx) => idx === stepIdx ? { active: !s.active } : s)
            }
          : n
      )
    };
    onPatternChange?.(updatedPattern);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        <button onClick={() => seqRef.current?.start()} disabled={!midiReady}>▶️ Play</button>
        <button onClick={() => seqRef.current?.stop()} disabled={!midiReady}>⏹ Stop</button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${pattern.length}, minmax(24px, 1fr))`,
          gap: '4px'
        }}
      >
        {pattern.notes.map((note, row) =>
          note.steps.map((step, col) => {
            const isActive = step.active;
            const isCurrent = col === currentStep;
            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleToggle(note.id, col)}
                style={{
                  width: '100%',
                  paddingTop: '100%', // square
                  position: 'relative',
                  backgroundColor: isActive ? 'steelblue' : '#eee',
                  opacity: isCurrent ? 1 : 0.6,
                  border: isCurrent ? '2px solid gold' : '1px solid #ccc',
                  cursor: 'pointer'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}