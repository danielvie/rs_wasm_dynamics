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
  let stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
  let numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;

  function DrawBody(x: number, y: number, w: number, h: number, r: number) {
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

      ctx.fillStyle = "#2d61a1";
      ctx.fill();
    }
  }

  function paint() {
    DrawBody(100 + model.states.x1 * 10, 20, 40, 40, 2);
    DrawBody(200 + model.states.x2 * 10, 20, 40, 40, 2);
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

  ok_btn?.addEventListener("click", () => {
    OK()
  });

  resety_btn?.addEventListener("click", () => {
    ResetY()
  });
  
  function OK() {
    x1_0 = parseFloat( (document.getElementById("value-x1") as HTMLInputElement).value);
    x2_0 = parseFloat( (document.getElementById("value-x2") as HTMLInputElement).value);
    m1_0 = parseFloat( (document.getElementById("value-m1") as HTMLInputElement).value);
    m2_0 = parseFloat( (document.getElementById("value-m2") as HTMLInputElement).value);
    c = parseFloat( (document.getElementById("value-c") as HTMLInputElement).value);
    k = parseFloat( (document.getElementById("value-k") as HTMLInputElement).value);

    model.reset(x1_0, x2_0, v1_0, v2_0, m1_0, m2_0, c, k);
    // model.states = State.from(x1_0, x2_0, v1_0, v2_0);
    // model.m1 = m1_0;
    // model.m2 = m2_0;
    // model.c = c;
    // model.k = k;
    
    // console.log(model.c)
    
    stepn = parseFloat((document.getElementById("value-stepn") as HTMLInputElement).value) || 30;
    numel = parseFloat((document.getElementById("value-numel") as HTMLInputElement).value) || 200;
    
    if (dataX1) {
      updateChart(model.time(),model.states.x1,model.states.x2)
    }
  }
  
  function ResetY() {
    max = Math.max(...dataX1)
    min = Math.min(...dataX1)
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
        timer.innerText = `timer: ${model.time()}`;
      }

      model.stepn(stepn);
      paint();

      updateChart(model.time(), model.states.x1, model.states.x2)

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
  const ctx_ = document.getElementById("myChart") as HTMLCanvasElement;
  const chart = new Chart(ctx_, {
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
  function updateChart(t: number, x1: number, x2: number) {
    
    t = Math.floor(t)
    
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

    chart.update('none')
  }

})