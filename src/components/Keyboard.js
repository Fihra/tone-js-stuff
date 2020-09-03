import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Piano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import 'react-piano/dist/styles.css';

const regular = {
    name: "Synth",
    sound: new Tone.PolySynth({
        voice: Tone.Synth
    })
}
const second = {
    name: "AMSynth",
    sound: new Tone.PolySynth({
        voice: Tone.AMSynth
    })
}
const third = {
    name: "FMSynth",
    sound: new Tone.PolySynth({
        voice: Tone.FMSynth
    })
}

const SynthManager = {
    name: "Default Synth",
    main: new Tone.PolySynth({
        voice: Tone.Synth
    })
};

const listOfSynths = [regular, second, third];

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('c6');
const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const PanningManager = {
    panner: new Tone.Panner({
        pan: 1
    })
}

let testPanner = new Tone.Panner(-1);

const Keyboard = () => {

    const [osc, setOsc] = useState(SynthManager);
    const [volume, setVolume] = useState(10);
    const [panLevel, setPanLevel] = useState(PanningManager);

    const [attackLevel, setAttackLevel] = useState(0);
    const [decayLevel, setDecayLevel] = useState(0);
    const [sustainLevel, setSustainLevel] = useState(0);
    const [releaseLevel, setReleaseLevel] = useState(0);

    useEffect(() => {

    }, [])

    const playNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.main.volume.value = volume;
        
        // osc.main.chain(testPanner);

        osc.main.set({
            envelope: {
                attack: attackLevel,
                decay: decayLevel,
                sustain: sustainLevel,
                release: releaseLevel
            }
        })

        osc.main.triggerAttack(savedNote, timeNow).toDestination();

    }

    const stopNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.main.volume.value = volume;

        // osc.main.disconnect(testPanner);
        osc.main.triggerRelease(savedNote, timeNow + 0.1).toDestination();
    }

    const SynthChoice = () => {
        return listOfSynths.map((synthy, index) => {
            return <option key={index} value={index}>{synthy.name}</option>
        })
    }

    const handleChange = (event) => {
        event.persist();
        let result = listOfSynths[event.target.value];
        setOsc({ main: result.sound });
    }

    const handleVolume = (event) => {
        event.persist();
        setVolume(event.target.value);
    }
    
    const handlePan = (event) => {
        // setPanLevel({...panLevel.panner, pan: event.target.value});
        event.persist();
        let result = new Tone.Panner({
            pan: event.target.value
        })
        
        setPanLevel({panner: result});
    }   
    // console.log(panLevel.panner.pan.value)

    const handleAttack = (e) => {
        setAttackLevel(e.target.value);
    }

    const handleDecay = (e) => {
        setDecayLevel(e.target.value);
    }

    const handleSustain = (e) => {
        setSustainLevel(e.target.value);
    }

    const handleRelease = (e) => {
        setReleaseLevel(e.target.value);
    }

    // const canvasRef = useRef(null);
    // const canvasObj = canvasRef.current;
    // const ctx = canvasObj.getContext('2d');

    // const drawGraph = () => {
    //     ctx.fillStyle = 'blue';
    //     ctx.save();
    // }

    return(
        <div>
            <Piano
                noteRange={{first: firstNote, last: lastNote}}
                playNote={(note) =>{playNote(note)}}
                stopNote={(note) => {stopNote(note)}}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
            />   
            <h3>Synths</h3>
            <select onChange={e => handleChange(e)}>
                {SynthChoice()}
            </select>
            <div className="controls-container">
            <label>Volume: {volume} db</label>
            <input type='range' min='-60' max='100' value={volume} onChange={(e) => handleVolume(e)}></input>
            <label>Pan: {panLevel.panner.pan.value} </label>
            <input type ='range' min='-1' max='1' value={panLevel.panner.pan.value} step='0.1' onChange={(e) => handlePan(e)}></input>

            {/* <label>Panning: {} </label>
            <input type ='range' min='-1' max='1' value={0.5} step='0.1' onChange={(e) => handlePan(e)}></input> */}
            <div>
                <label>Envelope</label>
                <div>
                    <label>Attack: {attackLevel}</label>
                    <input type='range' min='0' max='1' value={attackLevel} step='0.01' onChange={(e) => handleAttack(e)}></input>

                    <label>Decay: {decayLevel}</label>
                    <input type='range' min='0' max='1' value={decayLevel} step='0.01' onChange={(e) => handleDecay(e)}></input>

                    <label>Sustain: {sustainLevel}</label>
                    <input type='range' min='0' max='1' value={sustainLevel} step='0.01' onChange={(e) => handleSustain(e)}></input>

                    <label>Release: {releaseLevel}</label>
                    <input type='range' min='0' max='1' value={releaseLevel} step='0.01' onChange={(e) => handleRelease(e)}></input>
                </div>
            </div>

            </div>
            
        </div>
    )
}

export default Keyboard;