import init, { Model, State } from "mass_sim_dynamics";
import { Chart, registerables } from 'chart.js';


init().then((_wasm) => {
  // const worldWidth = 350;
  // const worldHeight = 100;
  const canvas = document.getElementById("model-canvas") as HTMLCanvasElement;
  canvas.height = 120;
  canvas.width = 350;
  const ctx = canvas.getContext("2d");

  const timer = document.getElementById("timer");
  // let stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
  // let numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;
  
  const COLOR = {
    "BLUE": "#517acc",
    "LITE_BLUE": "#7ba1ed",
    "PINK": "#fa6384"
  }

  let stepn = 20;
  let numel = 200;
  
  function DrawSpring(xleft: number, xright: number, color: string) {
    if (!ctx) { return }
    
    // params
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    // draw spring 
    const L = (xright - xleft)
    const w = Math.max(20 * L / 100, 8)
    
    const left = (L - w) / 2.0 + xleft
    const right = left + w

    const y  = 30.0
    const dy = 5.0
    const dx = w/12.0

    ctx.beginPath()
    ctx.moveTo(left, y)

    ctx.lineTo(left +  1*dx, y-dy)
    ctx.lineTo(left +  3*dx, y+dy)
    ctx.lineTo(left +  5*dx, y-dy)
    ctx.lineTo(left +  7*dx, y+dy)
    ctx.lineTo(left +  9*dx, y-dy)
    ctx.lineTo(left + 11*dx, y+dy)
    ctx.lineTo(left + 12*dx, y)
    
    ctx.moveTo(xleft, y)
    ctx.lineTo(left, y)
    ctx.moveTo(right, y)
    ctx.lineTo(xright, y)

    ctx.closePath()
    ctx.stroke()
  }

  function DrawDamper(xleft: number, xright: number, color: string) {
    if (!ctx) { return }
    
    // params
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    // draw spring 
    let L = (xright - xleft)
    let w = 15
    
    let left = (L - w) / 2.0 + xleft
    let right = left + w

    const y  = 50.0
    const dy = 5.0
    const dx = w/2.0

    ctx.beginPath()
    ctx.moveTo(right, y + dy)
    ctx.lineTo(left, y + dy)
    ctx.lineTo(left, y - dy)
    ctx.lineTo(right, y - dy)

    ctx.moveTo(left + dx, y + dy)
    ctx.lineTo(left + dx, y - dy)
    
    ctx.moveTo(xleft, y)
    ctx.lineTo(left, y)

    ctx.moveTo(right - dx, y)
    ctx.lineTo(xright, y)

    ctx.closePath()
    ctx.stroke()
  }

  function DrawGrid() {
    if (!ctx) { return }
    
    ctx.beginPath()
    
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1

    const grid = 10
    let x = 0
    let y = 0

    while (x < canvas.width) {
      x += grid
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    }

    ctx.closePath()
    ctx.stroke()
  }
  
  function DrawGround(y: number, h: number) {
    if (!ctx) { return }

    // ground
    const radius = 5
    const ground = y + h + radius * 2

    ctx.beginPath()
    ctx.strokeStyle = "#777"
    ctx.moveTo(0, ground)
    ctx.lineTo(canvas.width, ground)
    ctx.closePath()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.lineWidth = 1
    
    let xi = 0
    while (xi < canvas.width + 8) {
      ctx.moveTo(xi, ground)
      ctx.lineTo(xi - 8, ground + 7)
      
      xi += 5 
    }

    ctx.closePath()
    ctx.stroke()

  }

  function DrawBody(x: number, y: number, w: number, h: number, r: number, color: string) {
    if (!ctx) { return }

    // rounded box
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    
    ctx.fill();

    // wheels
    const radius = 5
    const ground = y + h + radius * 2

    ctx.beginPath()
    
    ctx.strokeStyle = color;
    ctx.fillStyle += "88"
    ctx.arc(x + w*2/7, ground - radius, radius, 0, 2*Math.PI)

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()

    ctx.strokeStyle = color;
    ctx.fillStyle += "88"
    ctx.arc(x + w*5/7, ground - radius, radius, 0, 2*Math.PI)

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
  }
  
  function DrawArrow(name: string, x: number, color: string) {
    if (!ctx) { return }

    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const groundTop = 20 + 40 + 5 * 2
    const groundBottom = 20 + 40 + 5 * 2 + 7
    const dy = 20

    ctx.beginPath()
    
    let yi = 0
    const spacing = 5
    const line = 8
    while(yi < groundTop) {
      ctx.moveTo(x, yi)
      yi += line
      
      yi = Math.min(yi, groundTop-1)
      ctx.lineTo(x, yi)
      yi += spacing
    }

    ctx.moveTo(x, groundBottom)
    ctx.lineTo(x, canvas.height)
    ctx.moveTo(x, canvas.height - dy)
    ctx.lineTo(x + 20, canvas.height - dy)

    ctx.lineTo(x + 10, canvas.height - dy - 10)

    ctx.moveTo(x + 20, canvas.height - dy)
    ctx.lineTo(x + 10, canvas.height - dy + 10)

    ctx.closePath()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.font = "20px monospace"
    ctx.fillText(name, x + 25, canvas.height - dy + 5)
    
  }

  function DrawRef(x: number) {
    if (!ctx) { return }
    
    ctx.strokeStyle = "#fccd9d"
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const bottom = 20 + 40 + 5 * 2

    const drie = 5
    ctx.moveTo(x-drie, 0)
    ctx.lineTo(x, drie)
    ctx.lineTo(x+drie, 0)


    ctx.lineWidth =  3
    let y = drie
    const spacing = 5
    const line =15
    
    while (y < bottom) {
      y += spacing
      ctx.moveTo(x, y)
      y += line
      ctx.lineTo(x, y)
    }
    
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.clearRect(x-drie, bottom, drie*2, drie*4)
    // ctx.rect(x-drie, bottom, drie*2, drie*4)
    ctx.closePath()
    ctx.fill()

    // ctx.beginPath()
    // ctx.closePath()
    // ctx.moveTo(x-drie, bottom)
    // ctx.lineTo(x, bottom - drie)
    // ctx.lineTo(x+drie, bottom)
    // ctx.stroke()

  }

  function paint() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height); // Clear the area before drawing

    const w = 40
    const dx1 = 100
    const dx2 = 200 + w
    
    const x1Block = dx1 + model.states.x1 * 10
    const x2Block = dx2 + model.states.x2 * 10

    DrawGrid()
    DrawRef(dx1 + model.m_setpoint * 10)
    DrawGround(20, w)
    DrawSpring(0, x1Block, COLOR.BLUE)
    DrawDamper(0, x1Block, COLOR.BLUE)
    DrawSpring(x1Block + 40, x2Block, COLOR.PINK)
    DrawDamper(x1Block + 40, x2Block, COLOR.PINK)

    DrawArrow("x1", dx1, COLOR.BLUE)
    DrawArrow("x2", dx2, COLOR.PINK)

    DrawBody(x1Block, 20, w, w, 2, COLOR.BLUE);
    DrawBody(x2Block, 20, w, w, 2, COLOR.PINK);
  }

  let x1_0 = 0.0;
  let x2_0 = 0.0;
  let v1_0 = 0.0;
  let v2_0 = 0.0;
  let m1 = 1.0;
  let m2 = 1.0;
  let c = 1.0;
  let k = 1.0;

  const reset_btn = document.getElementById("ok-btn");
  const fity_btn = document.getElementById("fit-y-btn");
  const paramset_btn = document.getElementById("param-set-btn");
  const controlon_btn = document.getElementById("control-on-btn");
  const controlflip_btn = document.getElementById("control-flip-btn");

  reset_btn?.addEventListener("click", () => {
    Reset()
  });

  fity_btn?.addEventListener("click", () => {
    FitY()
  });

  controlon_btn?.addEventListener("click", () => {
    ControlTOGGLE()
  });

  paramset_btn?.addEventListener("click", () => {
    UpdateParams()
  });

  controlflip_btn?.addEventListener("click", () => {
    ControlFlip()
  });
  
  function ControlFlip() {
    const in_setpoint = document.getElementById("value-setpoint") as HTMLInputElement
    if (!in_setpoint) { return }

    const setpoint = parseFloat(in_setpoint.value);
    in_setpoint.value = `${-setpoint}`

    UpdateParams()
  }
  
  function UpdateParams() {
    
    // update values
    x1_0 = parseFloat( (document.getElementById("value-x1") as HTMLInputElement).value);
    x2_0 = parseFloat( (document.getElementById("value-x2") as HTMLInputElement).value);
    m1 = parseFloat( (document.getElementById("value-m1") as HTMLInputElement).value);
    m2 = parseFloat( (document.getElementById("value-m2") as HTMLInputElement).value);
    c = parseFloat( (document.getElementById("value-c") as HTMLInputElement).value);
    k = parseFloat( (document.getElementById("value-k") as HTMLInputElement).value);
    
    model.states.x1 = x1_0
    model.states.x2 = x2_0
    model.m1 = m1
    model.m2 = m2
    model.c = c
    model.k = k

    // update control
    const kp = parseFloat( (document.getElementById("value-kp") as HTMLInputElement).value);
    const ki = parseFloat( (document.getElementById("value-ki") as HTMLInputElement).value);
    const kd = parseFloat( (document.getElementById("value-kd") as HTMLInputElement).value);
    const setpoint = parseFloat( (document.getElementById("value-setpoint") as HTMLInputElement).value);

    model.m_kp = kp
    model.m_ki = ki
    model.m_kd = kd
    model.m_setpoint = setpoint
  }
  
  function Reset() {
    UpdateParams()
    model.t = 0.0
    model.reset(x1_0, x2_0, v1_0, v2_0, m1, m2, c, k);
    ControlON(false)

    stepn = 40;
    numel = 200;
    
    if (dataX1) {
      updateChart()
    }
  }
  
  function FitY() {
    max = Math.max(...dataX1)
    min = Math.min(...dataX1)
  }
  
  function ControlON(value:boolean) {
    if (!controlon_btn || !paramset_btn || !controlflip_btn) { return }

    if (value) {
      controlon_btn.classList.remove("bg-red-800")
      controlon_btn.classList.add("bg-sky-800")
      controlon_btn.innerText = "control ON"

      model.m_controle_on = true
    } else {
      controlon_btn.classList.remove("bg-sky-800")
      controlon_btn.classList.add("bg-red-800")
      controlon_btn.innerText = "control OFF"

      model.m_controle_on = false
    }
  }

  function ControlTOGGLE() {
    if (!controlon_btn || !paramset_btn) { return }
    
    if (!model.m_controle_on) {
      ControlON(true)
    } else {
      ControlON(false)
    }

    UpdateParams()
  }
  
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Space":
        reset_btn?.click();
        break;
    }
  });

  let model = Model.new();
  model.states = State.from(x1_0, x2_0, v1_0, v2_0);
  UpdateParams()

  function play() {
    const fps = 100
    setTimeout(() => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (timer) {
        timer.innerText = `t: ${model.time().toFixed(1)}`;
      }

      model.stepn(stepn);
      
      paint();
      updateChart()
      requestAnimationFrame(play);
    }, 1000 / fps);
  }

  play();


  // Chart.register(CategoryScale, LinearScale, Title, Tooltip, BarController);
  Chart.register(...registerables);

  // Initialize an empty array for data
  const dataX1:number[] = []
  const dataX2:number[] = []
  const dataSet:number[] = []
  const labels:string[] = []
  
  // Create the initial chart
  const canvasg = document.getElementById("myChart") as HTMLCanvasElement;
  canvasg.width = 300
  canvasg.height = 250
  const chart = new Chart(canvasg, {
    type: "line",
    data: {
      // labels: labels,
      datasets: [
        {
          label: 'X1',
          data: dataX1,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'X2',
          data: dataX2,
          fill: "#235fd1",
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'ref',
          data: dataSet,
          fill: "#bbb",
          borderWidth: 1,
          pointRadius: 0
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              family: "monospace",
              size: 11,
            },
            boxWidth: 15,
          }
        }
      },
      scales: {
        y: {
          // suggestedMax: 10,
          // suggestedMin: -10,
        },
      },
    },
  });
  
  

  let max = -1
  let min = 1
  function updateChart() {
    
    const t  = Math.floor(model.time())
    const x1 = model.states.x1
    const x2 = model.states.x2
    const setp = model.m_setpoint

    dataX1.push(x1)
    dataX2.push(x2)
    dataSet.push(setp)
    labels.push(`${t}`)
    
    while (dataX1.length > numel) {
      dataX1.shift()
      dataX2.shift()
      dataSet.shift()
      labels.shift()
    }
    
    chart.data.datasets[0].data = dataX1
    chart.data.labels = labels

    max = Math.max(...dataX1, max)
    min = Math.min(...dataX1, min)
    
    if (chart.options.scales?.y) {
      chart.options.scales.y.suggestedMax = max
      chart.options.scales.y.suggestedMin = min
    }
    
    // update label
    const ref = model.m_setpoint

    const str_x1  = (x1 > 0.0) ? ` ${x1.toFixed(1)}` : `${x1.toFixed(1)}`
    const str_x2  = (x2 > 0.0) ? ` ${x2.toFixed(1)}` : `${x2.toFixed(1)}`
    const str_ref = (ref > 0.0) ? ` ${ref.toFixed(1)}` : `${ref.toFixed(1)}`

    chart.data.datasets[0].label = `x1(${str_x1})`
    chart.data.datasets[1].label = `x2(${str_x2})`
    chart.data.datasets[2].label = `ref(${str_ref})`

    chart.update('none')
  }

})