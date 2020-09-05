import React from 'react';
import './App.css';
// import { Synth, now} from 'tone';
import * as Tone from 'tone';
import Keyboard from './components/Keyboard';
import Composition from './components/Composition';

const App = () => {
  const synth = new Tone.Synth().toDestination();
  const anow = Tone.now();
  
  const playNote = () => {
    
    synth.triggerAttack("C4", anow);
    synth.triggerRelease(anow + 1)
  }

  const playMoreNotes = () => {
    synth.triggerAttackRelease("C4", "8n", anow);
    synth.triggerAttackRelease("E4", "8n", anow + 0.5);
    synth.triggerAttackRelease("G4", "8n", anow + 1);
  }

  const showTime = () => {
    setInterval(() => console.log(Tone.now()), 100);
  }

  const transporting = () => {
    const synthA = new Tone.FMSynth().toDestination();
    const synthB = new Tone.AMSynth().toDestination();
    
    const loopA = new Tone.Loop(time => {
      synthA.triggerAttackRelease("C2", "8n", time);
    }, "4n").start(0);

    const loopB = new Tone.Loop(time => {
      synthB.triggerAttackRelease("C4", "8n", time);
    }, "4n").start("8n");
    Tone.Transport.start();
    Tone.Transport.bpm.rampTo(800, 20);

  }

  const playInstruments = () => {
    const testSynth1 = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    testSynth1.triggerAttack("D4", now);
    testSynth1.triggerAttack("F4", now + 0.5);
    testSynth1.triggerAttack("A4", now + 1);
    testSynth1.triggerAttack("C5", now + 1.5);
    testSynth1.triggerAttack("E5", now + 2);
    testSynth1.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);
  }

  const testSample = () => {
    const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();

    Tone.loaded().then(() => {
      player.start();
    })

  }

  const testSampler = () => {
    const sampler = new Tone.Sampler({
      urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
    })
  }

  const testEffects = () => {
    const player2 = new Tone.Player({
      url: "https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3",
      loop: true,
      autostart: true,
    })
    const distortion = new Tone.Distortion(0.4).toDestination();
    player2.connect(distortion);
  }
  
  const testEffects3 = () => {
    const player3 = new Tone.Player({
      url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
      autostart: true,
    });
    const filter = new Tone.Filter(400, "lowpass").toDestination();
    const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();

    player3.connect(filter);
    player3.connect(feedbackDelay);
  }

  const testSignals = () => {
    const osc2 = new Tone.Oscillator().toDestination();
    osc2.frequency.value = "C4";
    osc2.frequency.rampTo("C2", 2);
    osc2.start().stop("+3");
  }

  return (
    <div className="App">
      <h1>Tone.js Playground</h1>
      {/* {playNote()} */}
      {/* {playMoreNotes()} */}
      {/* {showTime()} */}
      {/* {transporting()} */}
      {/* {playInstruments()} */}
      {/* {testSample()} */}
      {/* { testSampler()} */}
      {/* {testEffects()} */}
      {/* {testEffects3()} */}
      {/* {testSignals()} */}
      <Keyboard/>
      <Composition/>
    </div>
  );
}

export default App;
