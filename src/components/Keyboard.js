import React, { useState, useEffect } from 'react';
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
const volumeManager = {
    vol: new Tone.Volume({
        volume: 10
    })
};

const Keyboard = () => {

    const [osc, setOsc] = useState(SynthManager);
    const [volume, setVolume] = useState(volumeManager);

    useEffect(() => {
        // mainVolume = new Tone.Volume({
        //     volume: volume
        // });
    }, [])

    useEffect(() => {
        // console.log(volumeManager.vol);
    }, []);

    const playNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.main.chain(volumeManager.vol, Tone.Master)
        osc.main.triggerAttack(savedNote, timeNow).toDestination();
    }

    const stopNote = (note) => {
        const timeNow = Tone.now();
        let savedNote = Tone.Frequency(note, "midi").toNote();
        osc.main.chain(volumeManager.vol, Tone.Master)
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
        let newVolume = new Tone.Volume({
            volume: event.target.value
        })
        // console.log(newVolume)
        // console.log(event.target.value);
        setVolume(newVolume)
        // setVolume({vol: new Tone.Volume({
        //     volume: event.target.value
        // })});
    }

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
            <label>Volume</label>
            <input type='range' min='0' max='100' value={10} onChange={(e) => handleVolume(e)}></input>
            </div>
            
        </div>
    )
}

export default Keyboard;