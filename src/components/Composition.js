import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

let plucker = new Tone.PluckSynth().toDestination();
let bassSynth = new Tone.MembraneSynth().toDestination();
let cymbalSynth = new Tone.MetalSynth(
    {
        frequency : 100 ,
        envelope : {
        attack : 0.025 ,
        decay : 0.5,
        release : 0.5
        }
        ,
        harmonicity : 5.1 ,
        modulationIndex : 32 ,
        resonance : 2000 ,
        octaves : 0.5
        }        
).toDestination(); 
let duo = new Tone.FMSynth().toDestination();
let notes = ["C2", "Eb2", "G2", "Eb2", null, "Ab2", "G2", null, "Eb2", "Bb1", "Eb2", "Bb1", "Ab2", "G2", null, "Bb1"];

let noteChoices = ["C", "D", "E", "F","G", "A", "B", {"Rest": null}];
let accidental = ["#", "b"];

let bassDrumPart = ["C2", null, null, null, "C2", null, null, null, "C2", null, null, null, "C2", null, null, null,];
let cymbalSynthPart = [50, null, 50, null, 50, null, 50, null, 50, null, 50, null, 50, null, 50, null];

const Composition = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicNotes, setMusicNotes] = useState(notes);
    const [tempo, setTempo] = useState(120);

    const synthPart = new Tone.Sequence( (time, note) => {
        plucker.triggerAttackRelease(note, "10hz", time + 0.1);
    }, musicNotes, "16n");

    const drumPart = new Tone.Sequence((time, note) => {
        bassSynth.triggerAttackRelease(note, "5hz", time + 0.1);
    }, bassDrumPart, "16n");

    const cymbalPart = new Tone.Sequence((time, note) => {
        cymbalSynth.volume.value = -20;
        cymbalSynth.triggerAttackRelease(note, "16n", time + 0.1);
    }, cymbalSynthPart, "16n")

    useEffect(() => {
        if(isPlaying){
            // let loopBeat = new Tone.Loop((time) => song(time), '16n');
            // Tone.Transport.bpm.value = 100;
            synthPart.start();
            drumPart.start();
            cymbalPart.start();
            Tone.Transport.bpm.value = tempo;
            Tone.Transport.start();
            // loopBeat.start(0);
        } else {
            synthPart.stop();
            drumPart.stop();
            cymbalPart.stop();
            Tone.Transport.cancel(0);
            Tone.Transport.stop();
        }
    }, [isPlaying])

    const showAvailableNotes = (note) => {
        return noteChoices.map(nc => {
            return (
                typeof(nc) === 'object' ? 
                <option value={nc.rest}>{Object.keys(nc)}</option> :
                <option value={nc}>{nc}</option>    
            )
        })
    }

    const joinNotes = (givenNotes) => {
        return givenNotes.join('');
    }

    const addAccidental = (newNote, givenAccidental) => {
        let copiedNotes = [...newNote];

        if(newNote.length === 2){
            copiedNotes.splice(1, 0, givenAccidental);
        } else if(newNote.length === 3){
            givenAccidental === "#" ? 
            copiedNotes[1] = accidental[0]:
            copiedNotes[1] = accidental[1]
        }
        return joinNotes(copiedNotes);
    }

    const handleNoteChange = (note, i, e) => {
        let copyNoteCollection = [...musicNotes];
        // console.log(e.target.value );
        if(e.target.value === 'Rest'){
            // console.log(noteChoices[7]["Rest"]);
            copyNoteCollection[i] = noteChoices[7]["Rest"];
            setMusicNotes(copyNoteCollection);

        } else {
            // console.log(note);
            if(note ===  noteChoices[7]["Rest"]){
                copyNoteCollection[i] = `${e.target.value}2`;
                setMusicNotes(copyNoteCollection);
            } else {
                let newNote = note.split("");
                newNote[0] = e.target.value;           
                copyNoteCollection[i] = joinNotes(newNote);
                setMusicNotes(copyNoteCollection);
            }   
        }   
    }

    const handleAccidentalChange = (note, i, e) => {
        let copyNoteCollection = [...musicNotes];
        let updatedNote;

        if(typeof(note) === 'object'){
            console.log('resting');
        } else{
            let newNote = note.split("");
            switch(e.target.value){
                case "Natural":
                    updatedNote = newNote.filter(item => {
                        return (item !== "b") && (item !== "#")
                    });
                    updatedNote = joinNotes(updatedNote);
                    break;
                case "#":
                    updatedNote = addAccidental(newNote, accidental[0])
                    break;
                case "b":
                    updatedNote = addAccidental(newNote, accidental[1])
                    break;
                default:
                    break;
            }
            copyNoteCollection[i] = updatedNote;
            setMusicNotes(copyNoteCollection);
        }
    }

    const handleTempo = (e) => {
        setTempo(e.target.value);
    }

    const showComposition = () => {
        return musicNotes.map((note, i) => {   
            return (
                <div className="note-container">
                    <label>{typeof(note) === 'object' ? "Rest" : note}</label>
                    <div onChange={(e) => handleAccidentalChange(note, i, e)}>
                        <input type="radio" value="Natural" name="accidentalHolder"/>Natural
                        <input type="radio" value={accidental[0]} name="accidentalHolder"/>{accidental[0]}
                        <input type="radio" value={accidental[1]} name="accidentalHolder"/>{accidental[1]}
                    </div>
                    <select onChange={(e) => handleNoteChange(note, i, e)}>
                        {showAvailableNotes(note)}
                    </select>
                </div>           
            )
        })
    }

    return(
        <div>
            Composition
            <button onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying ? "Stop" : "Play"}</button>
            <label>Tempo: {tempo}</label>
            <input type="range" min="40" max="200" value={tempo} onChange={(e) => handleTempo(e)}></input>
            <div className="music-container">
                 {showComposition()}
            </div>
        </div>
    )
}

export default Composition;