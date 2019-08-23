let synth = new Tone.MonoSynth({
	oscillator: {type:"sawtooth"},
	envelope: {
		attack: 0.1,
		release: 4,
		releaseCurve: "linear"
	},
	filterEnvelope: {
		baseFrequency: 200,
		octaves: 2,
		attack: 0,
		delay: 0,
		release: 1000
	}
});
synth.toMaster();
synth.triggerAttackRelease("C4", 1);

console.log("You should have heard a tone")