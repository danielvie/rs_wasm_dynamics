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
    if (ctx) {
      ctx.clearRect(x, y, w, h); // Clear the area before drawing

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
  }

  function paint() {
    DrawBody(100 + model.states.x1 * 10, 20, 40, 40, 2, "#2d61a1");
    DrawBody(200 + model.states.x2 * 10, 20, 40, 40, 2, "#fa6384");
  }

  let x1_0 = 1.0;
  let x2_0 = 0.0;
  let v1_0 = 0.0;
  let v2_0 = 0.0;
  let m1_0 = 1.0;
  let m2_0 = 1.0;
  let c = 1.0;
  let k = 1.0;

  const ok_btn = document.getElementById("ok-btn");
  const resety_btn = document.getElementById("reset-y-btn");
  const controlon_btn = document.getElementById("control-on-btn");

  ok_btn?.addEventListener("click", () => {
    OK()
  });

  resety_btn?.addEventListener("click", () => {
    ResetY()
  });

  controlon_btn?.addEventListener("click", () => {
    ControlON()
  });
  
  function UpdateValues() {
    x1_0 = parseFloat( (document.getElementById("value-x1") as HTMLInputElement).value);
    x2_0 = parseFloat( (document.getElementById("value-x2") as HTMLInputElement).value);
    m1_0 = parseFloat( (document.getElementById("value-m1") as HTMLInputElement).value);
    m2_0 = parseFloat( (document.getElementById("value-m2") as HTMLInputElement).value);
    c = parseFloat( (document.getElementById("value-c") as HTMLInputElement).value);
    k = parseFloat( (document.getElementById("value-k") as HTMLInputElement).value);
    
    model.t = 0.0
    model.states.x1 = x1_0
    model.states.x2 = x2_0
    model.m1 = m1_0
    model.m2 = m2_0
    model.c = c
    model.k = k
  }
  
  function OK() {
    UpdateValues()
    model.reset(x1_0, x2_0, v1_0, v2_0, m1_0, m2_0, c, k);
    // model.states = State.from(x1_0, x2_0, v1_0, v2_0);
    // model.m1 = m1_0;
    // model.m2 = m2_0;
    // model.c = c;
    // model.k = k;
    
    // console.log(model.c)
    
    // stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
    // numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;

    stepn = 30;
    numel = 200;
    
    if (dataX1) {
      updateChart()
    }
  }
  
  function ResetY() {
    max = Math.max(...dataX1)
    min = Math.min(...dataX1)
  }
  
  function ControlON() {
    if (!controlon_btn) { return }
    
    controlon_btn.classList.remove("bg-red-800")
    controlon_btn.classList.add("bg-sky-800")
    controlon_btn.innerText = "SET control"

    UpdateValues()
    
    console.log(model.m1, model.m2)

    const kp = parseFloat( (document.getElementById("value-kp") as HTMLInputElement).value);
    const ki = parseFloat( (document.getElementById("value-ki") as HTMLInputElement).value);
    const kd = parseFloat( (document.getElementById("value-kd") as HTMLInputElement).value);
    const setpoint = parseFloat( (document.getElementById("value-setpoint") as HTMLInputElement).value);

    model.m_kp = kp
    model.m_ki = ki
    model.m_kd = kd
    model.m_setpoint = setpoint
    model.m_controle_on = true
    console.log('control on', model.m_controle_on)
  }

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Space":
        ok_btn?.click();
        break;
    }
  });

  let model = Model.new();
  model.states = State.from(x1_0, x2_0, v1_0, v2_0);

  function play() {
    const fps = 100;
    setTimeout(() => {
      // Clear the canvas at the beginning of each frame
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (timer) {
        timer.innerText = `t: ${model.time()}`;
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
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              family: "monospace"
            }
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

    dataX1.push(x1)
    dataX2.push(x2)
    labels.push(`${t}`)
    
    while (dataX1.length > numel) {
      dataX1.shift()
      dataX2.shift()
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
    const str_x1 = (x1 > 0.0) ? ` ${x1.toFixed(2)}` : `${x1.toFixed(2)}`
    const str_x2 = (x2 > 0.0) ? ` ${x2.toFixed(2)}` : `${x2.toFixed(2)}`

    chart.data.datasets[0].label = `x1(${str_x1})`
    chart.data.datasets[1].label = `x2(${str_x2})`

    chart.update('none')
  }

})