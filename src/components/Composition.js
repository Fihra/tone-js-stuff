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
        console.log(time);
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
            console.log("stopppppp");
            synthPart.stop();
            
            Tone.Transport.cancel(0);
            Tone.Transport.stop();

        }
    }, [isPlaying])

    const song = (time) => { 
        // if(counter%4 === 0){
        //     plucker.triggerAttackRelease("C2", "8n", time);  
        //     const seq = new Tone.Sequence((time, note) => {
        //         console.log(time);
        //         plucker.triggerAttackRelease(note, '4n'); 
        //     }, notes, '8n');
        //     seq.start(0);
        // }
        
        // if(counter%2 === 0) {
        //     duo.triggerAttackRelease("G4", '16n', time, 0.3);
        // }

        // plucker.triggerAttackRelease("Eb2", "8n", time);
       
        // console.log(Tone.Transport.position);

        counter = (counter + 1) % 16
    }

    const showAvailableNotes = (note) => {
        return noteChoices.map(nc => {
            return (
                typeof(nc) === 'object' ? 
                <option value={nc.rest}>{Object.keys(nc)}</option> :
                <option value={nc}>{nc}</option>    
            )
        })
    }

    const handleNoteChange = (note, i, e) => {
        // e.persist();
        // console.log(i);
        // console.log(e.target.value);
        let newNote = note.split("");
        newNote[0] = e.target.value;
        // console.log(newNote);

        let joinedNote = newNote.join('');
        // console.log(joinedNote);
        
        let copyNoteCollection = [...musicNotes];
        copyNoteCollection[i] = joinedNote;

        setMusicNotes(copyNoteCollection);

    }

    const showComposition = () => {
        return musicNotes.map((note, i) => {
            
            return (
                <div className="note-container">
                    <label>{typeof(note) === 'object' ? "Rest" : note}</label>
                    <div>
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