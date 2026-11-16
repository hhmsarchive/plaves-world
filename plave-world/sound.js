// Click sound effect, made with the Web Audio API (no sound file needed)

let audioCtx = null;

// Play one short "blip" sound (retro game style)
function playBlip(startFreq, endFreq, duration) {
  // Create the audio system the first time (browsers need a click first)
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();  // makes the sound wave
  const gain = audioCtx.createGain();       // controls the volume
  const now = audioCtx.currentTime;

  osc.type = "square";                      // square wave = 8-bit sound
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.linearRampToValueAtTime(endFreq, now + duration);

  gain.gain.setValueAtTime(0.06, now);      // low volume
  gain.gain.linearRampToValueAtTime(0, now + duration); // fade out (no pop)

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Play the sound on every click on the page
document.addEventListener("click", function () {
  playBlip(660, 990, 0.09);
});
