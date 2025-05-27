// src/containers/SequencerContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { Pattern } from '../models';
import type { Output } from 'webmidi';
import { WebMidi } from 'webmidi';
import { Sequencer } from '../sequencer';
import PatternControls from '../components/PatternControls';
import NoteRow from '../components/NoteRow';

// Default pattern setup
const defaultPattern: Pattern = {
  id: 'p1',
  name: 'My Pattern',
  tempo: 120,
  length: 16,
  channel: 1,
  notes: [
    {
      id: 'n1',
      note: 60,
      velocity: 100,
      length: 1,
      steps: Array(16).fill({ active: false })
    }
  ]
};

export default function SequencerContainer() {
  const [pattern, setPattern] = useState<Pattern>(defaultPattern);
  const seqRef = useRef<Sequencer>();

  // Initialize Web MIDI and Sequencer
  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        const out: Output | undefined = WebMidi.outputs[0];
        if (!out) throw new Error('No MIDI output found');
        seqRef.current = new Sequencer(pattern, out);
      })
      .catch(err => console.error('MIDI init failed', err));
  }, []);

  // Update sequencer when pattern changes
  useEffect(() => {
    if (seqRef.current) {
      seqRef.current.setPattern(pattern);
    }
  }, [pattern]);

  // Toggle a step on/off
  const toggleStep = (noteId: string, stepIdx: number) => {
    setPattern(p => ({
      ...p,
      notes: p.notes.map(n =>
        n.id === noteId
          ? {
              ...n,
              steps: n.steps.map((s, i) =>
                i === stepIdx ? { active: !s.active } : s
              )
            }
          : n
      )
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <PatternControls
        pattern={pattern}
        onUpdate={upd => setPattern(p => ({ ...p, ...upd }))}
        onSave={() => {
          // implement save logic (e.g., localStorage or IndexedDB)
        }}
        onLoad={p => setPattern(p)}
        onPlay={() => seqRef.current?.start()}
        onStop={() => seqRef.current?.stop()}
      />

      <div className="space-y-2">
        {pattern.notes.map(n => (
          <NoteRow
            key={n.id}
            note={n}
            patternLength={pattern.length}
            onToggleStep={i => toggleStep(n.id, i)}
            onUpdateNote={fields =>
              setPattern(p => ({
                ...p,
                notes: p.notes.map(x =>
                  x.id === n.id ? { ...x, ...fields } : x
                )
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}
