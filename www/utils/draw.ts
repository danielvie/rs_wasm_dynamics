// constants i need to remove
const radius = 7;
const hbody = 40;
const wbody = 40;
const rbody = 2;

const canvas = document.getElementById("model-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function GetGround(): number[] {
  const groundTop = 85;
  const groundBottom = groundTop + 7;
  return [groundTop, groundBottom];
}

export function DrawGrid() {
  if (!ctx) {
    return;
  }

  ctx.beginPath();

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  const grid = 10;
  let xi = 0;

  while (xi < canvas.width) {
    xi += grid;
    ctx.moveTo(xi, 0);
    ctx.lineTo(xi, canvas.height);
  }

  ctx.closePath();
  ctx.stroke();
}

export function DrawU(x: number) {
  if (!ctx) {
    return;
  }

  const y = 16;
  const dx = 7;
  const dy = 7;

  const color = "#aaa";

  ctx.beginPath();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y);

  ctx.moveTo(x + 20, y);
  ctx.lineTo(x + 20 - dx, y - dy);
  ctx.moveTo(x + 20, y);
  ctx.lineTo(x + 20 - dx, y + dy);

  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = "20px monospace";
  ctx.fillText("F", x + 25, y + 5);
}

export function DrawGround(
  y: number,
  h: number
) {
  if (!ctx) {
    return;
  }

  // ground
  const [groundTop, groundBottom] = GetGround();

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.moveTo(0, groundTop);
  ctx.lineTo(canvas.width, groundTop);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 1;

  let xi = 0;
  while (xi < canvas.width + 8) {
    ctx.moveTo(xi, groundTop);
    ctx.lineTo(xi - 8, groundBottom);

    xi += 5;
  }

  ctx.closePath();
  ctx.stroke();
}

export function DrawRef(x: number) {
  if (!ctx) {
    return;
  }

  ctx.strokeStyle = "#fccd9d";
  ctx.lineWidth = 3;
  ctx.beginPath();

  const groundTop = GetGround()[0];

  const drie = 5;
  ctx.moveTo(x - drie, 0);
  ctx.lineTo(x, drie);
  ctx.lineTo(x + drie, 0);

  ctx.lineWidth = 3;
  let y = drie;
  const spacing = 5;
  const line = 15;

  while (y < groundTop) {
    y += spacing;
    ctx.moveTo(x, y);
    y += line;
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.clearRect(x - drie, groundTop, drie * 2, drie * 4);
  ctx.closePath();
  ctx.fill();
}

export function DrawArrow(
  name: string,
  x: number,
  color: string
) {
  if (!ctx) {
    return;
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const [groundTop, groundBottom] = GetGround();
  const dy = 13;

  ctx.beginPath();

  let yi = 0;
  const spacing = 5;
  const line = 8;
  while (yi < groundTop) {
    ctx.moveTo(x, yi);
    yi += line;

    yi = Math.min(yi, groundTop - 1);
    ctx.lineTo(x, yi);
    yi += spacing;
  }

  // draw line bottom
  ctx.moveTo(x, groundBottom);
  ctx.lineTo(x, canvas.height);

  // draw arrow
  const y = canvas.height - dy;
  const ddy = 7;
  const ddx = 7;

  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y);
  ctx.lineTo(x + 20 - ddx, canvas.height - dy - ddy);
  ctx.moveTo(x + 20, canvas.height - dy);
  ctx.lineTo(x + 20 - ddx, canvas.height - dy + ddy);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = "20px monospace";
  ctx.fillText(name, x + 25, canvas.height - dy + 7);
}

export function DrawBody(x: number, color: string) {
  if (!ctx) {
    return;
  }

  // get ground
  const groundTop = GetGround()[0];

  // wheels
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.fillStyle += "88";
  ctx.arc(x + (wbody * 2) / 7, groundTop - radius, radius, 0, 2 * Math.PI);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();

  ctx.strokeStyle = color;
  ctx.fillStyle += "88";
  ctx.arc(x + (wbody * 5) / 7, groundTop - radius, radius, 0, 2 * Math.PI);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // box
  const y = groundTop - hbody - radius * 2;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(x + rbody, y);
  ctx.lineTo(x + wbody - rbody, y);
  ctx.quadraticCurveTo(x + wbody, y, x + wbody, y + rbody);
  ctx.lineTo(x + wbody, y + hbody - rbody);
  ctx.quadraticCurveTo(x + wbody, y + hbody, x + wbody - rbody, y + hbody);
  ctx.lineTo(x + rbody, y + hbody);
  ctx.quadraticCurveTo(x, y + hbody, x, y + hbody - rbody);
  ctx.lineTo(x, y + rbody);
  ctx.quadraticCurveTo(x, y, x + rbody, y);
  ctx.closePath();

  ctx.fill();
}

export function DrawDamper(
  xleft: number,
  xright: number,
  color: string
) {
  if (!ctx) {
    return;
  }

  // params
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // draw spring
  let L = xright - xleft;
  let w = 15;

  let left = (L - w) / 2.0 + xleft;
  let right = left + w;

  const groundTop = GetGround()[0];
  const bodyBottom = groundTop - radius * 2;
  const bodyTop = bodyBottom - hbody;

  const y = bodyBottom - ((bodyBottom - bodyTop) * 2) / 7;

  const dy = 5.0;
  const dx = w / 2.0;

  ctx.beginPath();
  ctx.moveTo(right, y + dy);
  ctx.lineTo(left, y + dy);
  ctx.lineTo(left, y - dy);
  ctx.lineTo(right, y - dy);

  ctx.moveTo(left + dx, y + dy);
  ctx.lineTo(left + dx, y - dy);

  ctx.moveTo(xleft, y);
  ctx.lineTo(left, y);

  ctx.moveTo(right - dx, y);
  ctx.lineTo(xright, y);

  ctx.closePath();
  ctx.stroke();
}

export function DrawSpring(
  xleft: number,
  xright: number,
  color: string
) {
  if (!ctx) {
    return;
  }

  // params
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // draw spring
  const L = xright - xleft;
  const w = Math.max((20 * L) / 100, 8);

  const left = (L - w) / 2.0 + xleft;
  const right = left + w;

  const groundTop = GetGround()[0];
  const bodyBottom = groundTop - radius * 2;
  const bodyTop = bodyBottom - hbody;

  const y = bodyBottom - ((bodyBottom - bodyTop) * 5) / 7;

  const dy = 5.0;
  const dx = w / 12.0;

  ctx.beginPath();
  ctx.moveTo(left, y);

  ctx.lineTo(left + 1 * dx, y - dy);
  ctx.lineTo(left + 3 * dx, y + dy);
  ctx.lineTo(left + 5 * dx, y - dy);
  ctx.lineTo(left + 7 * dx, y + dy);
  ctx.lineTo(left + 9 * dx, y - dy);
  ctx.lineTo(left + 11 * dx, y + dy);
  ctx.lineTo(left + 12 * dx, y);

  ctx.moveTo(xleft, y);
  ctx.lineTo(left, y);
  ctx.moveTo(right, y);
  ctx.lineTo(xright, y);

  ctx.closePath();
  ctx.stroke();
}
