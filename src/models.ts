// src/models.ts

/** One “step” in the sequence */
export interface Step {
  active: boolean;
}

/** Rename Track → Note, with length & velocity */
export interface Note {
  /** unique identifier */
  id: string;
  /** MIDI note number (e.g. 60 = Middle C) */
  note: number;
  /** how many steps the note holds before NoteOff */
  length: number;
  /** velocity 0–127 */
  velocity: number;
  /** which steps trigger this note */
  steps: Step[];
}

/** The full pattern, now with a default channel */
export interface Pattern {
  id: string;
  name: string;
  /** BPM */
  tempo: number;
  /** total steps (e.g. 16) */
  length: number;
  /** default MIDI channel for all notes */
  channel: number;
  /** collection of Note objects */
  notes: Note[];
}
