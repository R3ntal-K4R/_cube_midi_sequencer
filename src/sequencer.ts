// sequencer.ts
import { Pattern } from './models';
import type { Output } from 'webmidi';

export class Sequencer {
  private timer?: number;
  constructor(private pattern: Pattern, private output: Output) {}

  setPattern(p: Pattern) {
    this.pattern = p;
  }

  start() {
    const interval = (60 / this.pattern.tempo) / 4 * 1000;
    let step = 0;
    this.timer = window.setInterval(() => {
      for (const n of this.pattern.notes) {
        if (n.steps[step].active) {
          this.output.sendNoteOn(n.note, { 
            velocity: n.velocity / 127, 
            channel: this.pattern.channel 
          });
          setTimeout(() => {
            this.output.sendNoteOff(n.note, { channel: this.pattern.channel });
          }, n.length * interval);
        }
      }
      step = (step + 1) % this.pattern.length;
    }, interval);
  }

  stop() {
    if (this.timer != null) clearInterval(this.timer);
  }
}
