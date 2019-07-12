let audioContext = new AudioContext();

fetch("inthegarage.mp3")
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
  	let sourceNode = audioContext.createBufferSource();
  	sourceNode.buffer = audioBuffer;
  	sourceNode.loop = true;
  	sourceNode.loopStart = 0.85;
  	sourceNode.loopEnd = 10.53;
  	sourceNode.connect(audioContext.destination);
  	sourceNode.start();
  })
  .catch(e => console.error(e));
