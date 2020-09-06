import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

let plucker = new Tone.PluckSynth().toDestination();
let duo = new Tone.FMSynth().toDestination();
let notes = ["C2", "Eb2", "G2", "Eb2", null, "Ab2", "G2", null, "Eb2", "Bb1", "Eb2", "Bb1", "Ab2", "G2", null, "Bb1"];
let counter = 0;

let noteChoices = ["C", "D", "E", "F","G", "A", "B", {"rest": null}];
let accidental = ["#", "b"];



const Composition = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicNotes, setMusicNotes] = useState(notes);

    const synthPart = new Tone.Sequence( (time, note) => {
        // console.log(time);
        plucker.triggerAttackRelease(note, "10hz", time + 0.1);
    }, musicNotes, "16n");

    useEffect(() => {
        if(isPlaying){
            // let loopBeat = new Tone.Loop((time) => song(time), '16n');
            // Tone.Transport.bpm.value = 100;
            synthPart.start();
            Tone.Transport.start();
            // loopBeat.start(0);
        } else {
            // console.log("stopppppp");
            synthPart.stop();
            
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
        // console.log(givenAccidental);
        if(newNote.length === 2){
            return copiedNotes.splice(1, 0, givenAccidental);
        } else if(newNote.length === 3){
            return copiedNotes[1] = accidental[0];
        }
    }

    const handleNoteChange = (note, i, e) => {
        let copyNoteCollection = [...musicNotes];
        
        if(typeof(note) === 'object'){
            console.log(note);
            copyNoteCollection[i] = note;
            setMusicNotes(copyNoteCollection);

        } else {
            let newNote = note.split("");
            newNote[0] = e.target.value;
            
            copyNoteCollection[i] = joinNotes(newNote);
            setMusicNotes(copyNoteCollection);
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
                    break;
                case "#":
                    updatedNote = addAccidental(newNote, accidental[0])
                    break;
                case "b":
                    // updatedNote = [...newNote];
                    // if(newNote.length === 2){
                    //     updatedNote.splice(1, 0, accidental[0]);
                    // } else if(newNote.length === 3){
                    //     updatedNote[1] = accidental[0];
                    // }
                    updatedNote = addAccidental(newNote, accidental[1])
                    console.log("Add b");
                    break;
                default:
                    break;
            }
            console.log(updatedNote);
            // copyNoteCollection[i] = joinNotes(updatedNote);
            // setMusicNotes(copyNoteCollection);
        }

        

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
            <div className="music-container">
                 {showComposition()}
            </div>
        </div>
    )
}

export default Composition;