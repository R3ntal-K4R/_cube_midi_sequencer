// src/components/PianoSequencerGrid.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { Pattern } from '../models';
import type { Output } from 'webmidi';
import { WebMidi } from 'webmidi';
import { Sequencer } from '../sequencer';

interface PianoSequencerGridProps {
  pattern: Pattern;
  onPatternChange?: (updated: Pattern) => void;
}

// Helper: map MIDI note number to name and determine white/black key
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function midiToName(num: number) {
  const octave = Math.floor(num / 12) - 1;
  const name = NOTE_NAMES[num % 12];
  return `${name}${octave}`;
}
function isBlackKey(num: number) {
  const mod = num % 12;
  return [1,3,6,8,10].includes(mod);
}

export default function PianoSequencerGrid({ pattern, onPatternChange }: PianoSequencerGridProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const seqRef = useRef<Sequencer>();
  const [midiReady, setMidiReady] = useState(false);

  // Initialize MIDI
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

  // Update pattern
  useEffect(() => {
    if (seqRef.current) seqRef.current.setPattern(pattern);
  }, [pattern]);

  const handleToggle = (noteId: string, stepIdx: number) => {
    const updated = {
      ...pattern,
      notes: pattern.notes.map(n =>
        n.id === noteId
          ? { ...n, steps: n.steps.map((s,i) => i === stepIdx ? { active: !s.active } : s) }
          : n
      )
    };
    onPatternChange?.(updated);
  };

  return (
    <div className="overflow-auto">
      <div className="mb-2">
        <button onClick={() => seqRef.current?.start()} disabled={!midiReady}>▶️ Play</button>
        <button onClick={() => seqRef.current?.stop()} disabled={!midiReady}>⏹ Stop</button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `150px repeat(${pattern.length}, minmax(24px, 1fr))`,
          gap: '2px'
        }}
      >
        {/* Header empty cell */}
        <div />
        {Array.from({ length: pattern.length }, (_, i) => (
          <div
            key={`col-${i}`}
            style={{ textAlign: 'center', fontSize: '0.8rem' }}
          >{i+1}</div>
        ))}

        {/* Rows */}
        {pattern.notes.map((note, row) => {
          const name = midiToName(note.note);
          const black = isBlackKey(note.note);
          return (
            <React.Fragment key={`row-${row}`}>
              {/* Key label */}
              <div
                style={{
                  padding: '4px',
                  backgroundColor: black ? '#333' : '#fff',
                  color: black ? '#fff' : '#000',
                  fontFamily: 'monospace',
                  border: '1px solid #ccc'
                }}
              >{name}</div>
              {note.steps.map((step, col) => {
                const isActive = step.active;
                const isCurrent = col === currentStep;
                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => handleToggle(note.id, col)}
                    style={{
                      width: '100%',
                      paddingTop: '100%',
                      position: 'relative',
                      backgroundColor: isActive ? '#4caf50' : '#e0e0e0',
                      opacity: isCurrent ? 1 : 0.7,
                      border: isCurrent ? '2px solid #ffeb3b' : '1px solid #bbb',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
