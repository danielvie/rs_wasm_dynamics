import init, { Model, State } from "mass_sim_dynamics";
import { Chart, registerables } from 'chart.js';


init().then((_wasm) => {
  // const worldWidth = 350;
  // const worldHeight = 100;
  const canvas = document.getElementById("model-canvas") as HTMLCanvasElement;
  canvas.height = 100;
  canvas.width = 350;
  const ctx = canvas.getContext("2d");

  const timer = document.getElementById("timer");
  // let stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
  // let numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;

  let stepn = 30;
  let numel = 200;

  function DrawBody(x: number, y: number, w: number, h: number, r: number, fill: string) {
    if (!ctx) { return }

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

    ctx.fillStyle = fill;
    ctx.fill();
  }
  
  function DrawSetP(x: number) {
    if (!ctx) { return }
    
    ctx.strokeStyle = "#fccd9d"
    ctx.beginPath()
    ctx.moveTo(x, -50)
    ctx.lineTo(x,  100)
    ctx.closePath()
    ctx.stroke()
  }

  function paint() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height); // Clear the area before drawing

    DrawSetP(100 + model.m_setpoint * 10)
    DrawBody(100 + model.states.x1 * 10, 20, 40, 40, 2, "#2d61a1");
    DrawBody(200 + model.states.x2 * 10, 20, 40, 40, 2, "#fa6384");
  }

  let x1_0 = 1.0;
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
    UpdateValues()
    ControlSet()
  }
  
  function UpdateValues() {
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
  }
  
  function Reset() {
    UpdateValues()
    model.t = 0.0
    model.reset(x1_0, x2_0, v1_0, v2_0, m1, m2, c, k);
    ControlON(false)

    // model.states = State.from(x1_0, x2_0, v1_0, v2_0);
    // model.m1 = m1_0;
    // model.m2 = m2_0;
    // model.c = c;
    // model.k = k;
    
    // stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
    // numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;

    stepn = 30;
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

      controlflip_btn.classList.remove("bg-red-800")
      controlflip_btn.classList.add("bg-sky-800")

      model.m_controle_on = true
    } else {
      controlon_btn.classList.remove("bg-sky-800")
      controlon_btn.classList.add("bg-red-800")
      controlon_btn.innerText = "control OFF"

      controlflip_btn.classList.remove("bg-sky-800")
      controlflip_btn.classList.add("bg-red-800")

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

    UpdateValues()
    ControlSet()
  }
  
  function ControlSet() {
    const kp = parseFloat( (document.getElementById("value-kp") as HTMLInputElement).value);
    const ki = parseFloat( (document.getElementById("value-ki") as HTMLInputElement).value);
    const kd = parseFloat( (document.getElementById("value-kd") as HTMLInputElement).value);
    const setpoint = parseFloat( (document.getElementById("value-setpoint") as HTMLInputElement).value);

    model.m_kp = kp
    model.m_ki = ki
    model.m_kd = kd
    model.m_setpoint = setpoint
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
    const fps = 100;
    setTimeout(() => {
      // Clear the canvas at the beginning of each frame
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (timer) {
        timer.innerText = `t: ${model.time()}`;
      }

      model.stepn(stepn);
      
      // if (model.m_controle_on)
      
      
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