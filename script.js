const canvas = document.querySelector("#security-canvas");
const ctx = canvas.getContext("2d");

const pointer = { x: 0, y: 0, active: false };
let nodes = [];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createNodes(rect.width, rect.height);
}

function createNodes(width, height) {
  const count = Math.max(34, Math.floor((width * height) / 24000));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    size: index % 5 === 0 ? 2.2 : 1.35,
  }));
}

function drawGrid(width, height) {
  ctx.strokeStyle = "rgba(244, 247, 239, 0.045)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);
  drawGrid(width, height);

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 150) {
        node.x -= dx * 0.002;
        node.y -= dy * 0.002;
      }
    }
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 145) {
        const opacity = 1 - distance / 145;
        ctx.strokeStyle = `rgba(78, 229, 155, ${opacity * 0.28})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    ctx.fillStyle = node.size > 2 ? "rgba(242, 200, 107, 0.85)" : "rgba(78, 229, 155, 0.75)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
draw();
