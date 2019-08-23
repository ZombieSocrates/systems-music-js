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
		volume: -20,
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

let leftPanner = new Tone.Panner(-0.5);
let rightPanner = new Tone.Panner(0.5);
// Wait one 16th note before beginning the echo, and feedback in 20% of the original signal
let echo = new Tone.FeedbackDelay("16n", 0.2)
let delay = Tone.context.createDelay(6.0);
let delayFade = Tone.context.createGain();

delay.delayTime.value = 6.0;
delayFade.gain.value= 0.75;

leftSynth.connect(leftPanner);
rightSynth.connect(rightPanner);
leftPanner.connect(echo);
rightPanner.connect(echo);
echo.toMaster();
echo.connect(delay);
delay.connect(Tone.context.destination);
delay.connect(delayFade);
delayFade.connect(delay);

new Tone.Loop(time => {
  // Trigger C5 and hold for a full one measure and two beats
  // Switch to note D5 after two beats without retriggering
  leftSynth.triggerAttackRelease("C5", "1:2", time);
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
  // Trigger D4 after 5 measures and hold for 1 full measure + two 1/4 notes
  // Switch to E4 after one more measure
  rightSynth.triggerAttackRelease("D4", "1:2", "+5:0");
  rightSynth.setNote("E4","+6:0");

  // Trigger B3 after 11 measures + two 1/4 notes + two 1/16 notes. Hold for one measure
  // Switch to G3 after a 1/2 note more
  rightSynth.triggerAttackRelease("B3", "1:0", "+11:2:2");
  rightSynth.setNote("G3", "+12:0:2");

  // Trigger G4 after 23 measures + two 1/4 notes. Hold for a half note.
  rightSynth.triggerAttackRelease("G4", "0:2", "+23:2");
}, "37m").start();


Tone.Transport.bpm.value = 120;
Tone.Transport.start();
