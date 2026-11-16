// Draws the night sky: small stars, constellations (white dots), and shooting stars

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let w, h;          // screen width and height
let stars = [];    // small twinkling stars
let shooting = null;

// Constellations: each point is a position from 0 to 1: [x, y].
// They are drawn as bigger white dots with a soft glow (no lines).
const constellations = [
  {
    // 5 stars in a row (one star for each member)
    points: [[0.38, 0.10], [0.46, 0.06], [0.54, 0.12], [0.62, 0.07], [0.70, 0.13]]
  },
  {
    // Big Dipper style (bottom left)
    points: [[0.05, 0.60], [0.11, 0.64], [0.17, 0.66], [0.22, 0.70],
             [0.31, 0.72], [0.30, 0.82], [0.21, 0.80]]
  },
  {
    // W shape (bottom right)
    points: [[0.78, 0.62], [0.82, 0.72], [0.87, 0.64], [0.92, 0.74], [0.96, 0.65]]
  }
];

// Set the canvas size and make the small stars
function resize() {
  const dpr = window.devicePixelRatio || 1;
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.floor((w * h) / 4000); // more stars on bigger screens
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,          // size
      speed: Math.random() * 0.002 + 0.0005, // twinkle speed
      phase: Math.random() * Math.PI * 2     // start time of twinkle
    });
  }
}

// Draw one frame
function draw(time) {
  ctx.clearRect(0, 0, w, h);

  // 1. Small stars (they twinkle)
  for (const s of stars) {
    const alpha = 0.3 + 0.7 * Math.abs(Math.sin(time * s.speed + s.phase));
    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Constellations (white dots with a soft white glow)
  ctx.shadowColor = "white";
  ctx.shadowBlur = 3;
  ctx.fillStyle = "white";
  for (const c of constellations) {
    for (const p of c.points) {
      ctx.beginPath();
      ctx.arc(p[0] * w, p[1] * h, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;

  // 3. Shooting star (appears sometimes)
  if (!shooting && Math.random() < 0.003) {
    shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.3, life: 0 };
  }
  if (shooting) {
    shooting.x += 8;
    shooting.y += 4;
    shooting.life++;
    ctx.strokeStyle = "rgba(255, 255, 255, " + (1 - shooting.life / 60) + ")";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shooting.x - 60, shooting.y - 30);
    ctx.lineTo(shooting.x, shooting.y);
    ctx.stroke();
    if (shooting.life > 60) shooting = null;
  }

  requestAnimationFrame(draw); // draw again on the next frame
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
