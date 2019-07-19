const SAMPLE_LIBRARY = {
		"Vibraphone":[
        {note: "A", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.A3.wav"},
        {note: "A", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.A4.wav"},
        {note: "A", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.A5.wav"},
        {note: "B", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.B3.wav"},
        {note: "B", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.B4.wav"},
        {note: "B", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.B5.wav"},
        {note: "C", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.C3.wav"},
        {note: "C", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.C4.wav"},
        {note: "C", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.C5.wav"},
        {note: "C", octave: 6, file: "samples/vibraphone/Vibraphone.sustain.ff.C6.wav"},
        {note: "D", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.D3.wav"},
        {note: "D", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.D4.wav"},
        {note: "D", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.D5.wav"},
        {note: "D", octave: 6, file: "samples/vibraphone/Vibraphone.sustain.ff.D6.wav"},
        {note: "E", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.E3.wav"},
        {note: "E", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.E4.wav"},
        {note: "E", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.E5.wav"},
        {note: "E", octave: 6, file: "samples/vibraphone/Vibraphone.sustain.ff.E6.wav"},
        {note: "F", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.F3.wav"},
        {note: "F", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.F4.wav"},
        {note: "F", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.F5.wav"},
        {note: "F", octave: 6, file: "samples/vibraphone/Vibraphone.sustain.ff.F6.wav"},
        {note: "G", octave: 3, file: "samples/vibraphone/Vibraphone.sustain.ff.G3.wav"},
        {note: "G", octave: 4, file: "samples/vibraphone/Vibraphone.sustain.ff.G4.wav"},
        {note: "G", octave: 5, file: "samples/vibraphone/Vibraphone.sustain.ff.G5.wav"}
		]
	}

const OCTAVE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let audioContext = new AudioContext();

function noteValue(note, octave) {
	return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
	return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
	let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
		let distanceToA = 
		  Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
		let distanceToB = 
		  Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
		return distanceToA - distanceToB
	});
	return sortedBank[0];
}

function flatToSharp(note) {
	switch (note) {
		case "Bb": return "A#";
		case "Db": return "C#";
		case "Eb": return "D#";
		case "Gb": return "F#";
		case "Ab": return "G#";
		default:   return note;
	}
}

function fetchSample(path) {
	return fetch(encodeURIComponent(path))
	  .then(response => response.arrayBuffer())
	  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSample(instrument, noteAndOctave) {
    let [, requestedNote, requestedOctave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave)
    requestedOctave = parseInt(requestedOctave, 10);
    requestedNote = flatToSharp(requestedNote);
    let sampleBank = SAMPLE_LIBRARY[instrument];
    let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
    let distance = 
      getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
    return fetchSample(sample.file).then(audioBuffer => ({
    	audioBuffer: audioBuffer,
    	distance: distance
    }));
}

function playSample(instrument, note, destination, delaySeconds = 0) {
	getSample(instrument, note).then(({audioBuffer, distance}) => {
		let playbackRate = Math.pow(2, distance / 12);
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
		bufferSource.playbackRate.value = playbackRate;
		bufferSource.connect(destination);
		bufferSource.start(audioContext.currentTime + delaySeconds);
	});
}

function startLoop(instrument, note, destination, loopLengthSeconds, delaySeconds) {
    playSample(instrument, note, destination, delaySeconds);
    setInterval(
        () => playSample(instrument, note, destination, delaySeconds), 
        loopLengthSeconds * 1000
    );
}



//Test out the pitch sampler
// setTimeout(() => playSample("Vibraphone", "F4"),  1000);
// setTimeout(() => playSample("Vibraphone", "Ab4"), 2000);
// setTimeout(() => playSample("Vibraphone", "C5"),  3000);
// setTimeout(() => playSample("Vibraphone", "Db5"), 4000);
// setTimeout(() => playSample("Vibraphone", "Eb5"), 5000);
// setTimeout(() => playSample("Vibraphone", "F5"),  6000);
// setTimeout(() => playSample("Vibraphone", "Ab5"), 7000);


//Pass each note through the convolver in loops with seven random lengths and offsets
fetchSample("AirportTerminal.wav").then(convolverBuffer => {

    let convolver = audioContext.createConvolver();
    convolver.buffer = convolverBuffer;
    convolver.connect(audioContext.destination);

    startLoop("Vibraphone", "F4", convolver, 18.1, 7.6);
    startLoop("Vibraphone", "Ab4", convolver, 20.2, 5.4);
    startLoop("Vibraphone", "C5", convolver, 17.6, 3.1);
    startLoop("Vibraphone", "Db5", convolver, 19.8, 8.5);
    startLoop("Vibraphone", "Eb5", convolver, 16.3, 4.2);
    startLoop("Vibraphone", "F5", convolver, 21.0, 6.8);
    startLoop("Vibraphone", "Ab5", convolver, 15.2, 7.2);

})
