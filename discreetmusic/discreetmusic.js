function makeSynth() {
	let envelope = {
		attack: 0.1,
		release: 4,
		releaseCurve: "linear"
	};
	let filterEnvelope = {
		baseFrequency: 200,
		octaves: 2,
		attack: 0,
		decay: 0,
		release: 1000
	};

	return new Tone.DuoSynth({
		harmonicity: 1,
		voice0: {
			oscillator: {type: "sawtooth"},
			envelope,
			filterEnvelope
		},
		voice1: {
			oscillator: {type: "sine"},
			envelope,
			filterEnvelope
		},
		vibratoRate: 0.5,
		vibratoAmount: 0.1
	});
}


let leftSynth = makeSynth();
let rightSynth = makeSynth();

let leftPanner = new Tone.Panner(-0.5).toMaster();
let rightPanner = new Tone.Panner(0.5).toMaster();

leftSynth.connect(leftPanner);
rightSynth.connect(rightPanner);

new Tone.Loop(time => {
  // Trigger C5 and hold for a full one measure and two beats
  leftSynth.triggerAttackRelease("C5", "1:2", time);

  // Switch to note D5 after two beats without retriggering
  leftSynth.setNote("D5", "+0:2");

  // Trigger E4 after 6 measures and hold for two 1/4 notes.
  leftSynth.triggerAttackRelease("E4", "0:2", "+6:0");

  // Trigger G4 after 11 measures + a two 1/4 notes, and hold for two 1/4 notes.
  leftSynth.triggerAttackRelease("G4", "0:2", "+11:2");

  // Trigger E5 after 19 measures and hold for 2 measures.
  // Switch to G5, A5, G5 after delay of a 1/4 note + two 1/16 notes each.
  leftSynth.triggerAttackRelease("E5", "2:0", "+19:0");
  leftSynth.setNote("G5", "+19:1:2");
  leftSynth.setNote("A5", "+19:3:0");
  leftSynth.setNote("G5", "+20:0:2");
}, "34m").start();

new Tone.Loop(time => {
  // // Trigger one quarter note from now, and hold for one eighth note
  // synth.triggerAttackRelease("C4", "8n", "+4n");
}, "37m").start();


Tone.Transport.bpm.value = 240;
Tone.Transport.start();
