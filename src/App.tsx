// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SequencerGrid from './components/SequencerGrid';
import PatternControls from './components/PatternControls';
import SequencerContainer from './containers/SequencerContainer';
import PianoSequencerGrid from './components/PianoSequencerGrid';

import type { Pattern } from './models';

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

export default function App() {
  const [pattern, setPattern] = useState<Pattern>(defaultPattern);

  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">Grid View</Link>
        <Link to="/controls" className="text-blue-600 hover:underline">Controls</Link>
      </nav>

      <main className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              <SequencerGrid
                pattern={pattern}
                onPatternChange={setPattern}
              />
            }
          />

          <Route
            path="/controls"
            element={
              <PatternControls
                pattern={pattern}
                onUpdate={(upd) => setPattern(p => ({ ...p, ...upd }))}
                onSave={() => {
                  // implement save logic here
                }}
                onLoad={(p) => setPattern(p)}
                onPlay={() => {
                  // Optionally trigger play via a ref or context
                }}
                onStop={() => {
                  // Optionally trigger stop
                }}
              />
            }
          />
        <Route path="/" element={<SequencerContainer />} />
        <Route path="/piano" element={<PianoSequencerGrid pattern={pattern} onPatternChange={setPattern} />} />

        </Routes>
      </main>
    </Router>
  );
}
