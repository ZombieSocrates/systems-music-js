let audioContext = new AudioContext();

function startLoop(audioBuffer, pan = 0, rate = 1) {
  let sourceNode = audioContext.createBufferSource();
  let pannerNode = audioContext.createStereoPanner();

  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.loopStart = 0.85; //0.85
  sourceNode.loopEnd = 10.53; //10.53
  sourceNode.playbackRate.value = rate;
  pannerNode.pan.value = pan;

  sourceNode.connect(pannerNode);
  sourceNode.connect(audioContext.destination);
  
  sourceNode.start();
}

fetch("inthegarage.mp3")
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
  	startLoop(audioBuffer, pan = -1);
    startLoop(audioBuffer, pan = 1, rate = 1.002); //rate = 1.002
  })
  .catch(e => console.error(e));
