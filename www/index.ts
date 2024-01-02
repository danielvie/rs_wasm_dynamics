import init, { Model, State, ControlType } from "mass_sim_dynamics";
import { Chart, registerables } from 'chart.js';

interface MyWasmModule {
  add: (a: number, b: number) => number;
  invert: (M: number, out: number) => void;
  invert_matrix: (a: number, r: number) => void;
  memory: WebAssembly.Memory;
  _free: (array: any) => number;
  _malloc: (pointer: number) => number;
}

async function loadCModule() {
  return fetch("add.wasm")
    .then((res) => res.arrayBuffer())
    .then((buf) => WebAssembly.instantiate(buf, {}))
    .then((was) => {
      const instance = was.instance;
      return instance.exports as unknown as MyWasmModule;
    });
}

declare const Module: any; 

init().then((_wasm) => {

  loadCModule().then((wasmModule) => {

    console.log(wasmModule)

    // Example usage for _invert
    const inputMatrix = new Float64Array([2, 5, 11, 3, 7, 9, 5, 11, 0]);

    console.log("input matrix: ", inputMatrix)

    // Allocate memory in the wasm module
    const inputArrayPointer = wasmModule._malloc(inputMatrix.length * Float64Array.BYTES_PER_ELEMENT);
    new Float64Array(wasmModule.memory.buffer, inputArrayPointer, inputMatrix.length).set(inputMatrix);

    // Call C function
    const outputArrayPointer = wasmModule._malloc(inputMatrix.length * Float64Array.BYTES_PER_ELEMENT);
     
    wasmModule.invert(inputArrayPointer, outputArrayPointer);
    console.log("outputarraypointer: ", outputArrayPointer)

    // Read result of computation
    const outputArray = new Float64Array(wasmModule.memory.buffer, outputArrayPointer, 19).slice();
    console.log("Inverted Result:", outputArray);

    // Free memory for the allocated arrays
    wasmModule._free(inputArrayPointer);
    wasmModule._free(outputArrayPointer);
  })


  // const worldWidth = 350;
  // const worldHeight = 100;
  const canvas = document.getElementById("model-canvas") as HTMLCanvasElement;
  canvas.height = 120;
  canvas.width = 350;
  const ctx = canvas.getContext("2d");

  const timer = document.getElementById("timer");
  const radius = 7
  const wbody = 40
  const hbody = 40
  const rbody = 2

  const COLOR = {
    "BLUE": "#517acc",
    "LITE_BLUE": "#7ba1ed",
    "PINK": "#fa6384"
  }

  let stepn = 20;
  let numel = 300;
  

  // bla
  const bla = document.getElementById("bla")
  if (bla) {
    console.log(_wasm.bla(ControlType.PID))
  }




  // let isDragging = false
  let lastX = 0
  let lastY = 0

  // canvas.addEventListener("mousedown", (event: MouseEvent) => {
  //   isDragging = true
  //   lastX = event.clientX - canvas.getBoundingClientRect().left
  //   lastY = event.clientX - canvas.getBoundingClientRect().top
  // })

  // canvas.addEventListener("mouseup", (_event: MouseEvent) => {
  //   isDragging = false
  // })

  canvas.addEventListener("click", (event: MouseEvent) => {
    // if (isDragging) {
      const currentX = event.clientX - canvas.getBoundingClientRect().left
      const currentY = event.clientX - canvas.getBoundingClientRect().top
      
      lastX = currentX
      lastY = currentY
      
      console.log(lastX)
      
      model.m_setpoint = (lastX - 100)/10

      const setpoint_in = document.getElementById("value-setpoint") as HTMLInputElement      
      setpoint_in.value = `${model.m_setpoint}`
    // }
  })

  
  // canvas.addEventListener("click", (event:MouseEvent) => {
  //   const x = event.clientX - canvas.getBoundingClientRect().left;
  //   const y = event.clientY - canvas.getBoundingClientRect().top;
  //   console.log(`${x}, ${y}`)
  // })
  
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

    const groundTop = GetGround()[0]
    const bodyBottom = groundTop - radius*2
    const bodyTop    = bodyBottom - hbody

    const y = bodyBottom - (bodyBottom - bodyTop)*5/7

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

    const groundTop = GetGround()[0]
    const bodyBottom = groundTop - radius*2
    const bodyTop    = bodyBottom - hbody

    const y = bodyBottom - (bodyBottom - bodyTop)*2/7

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
    let xi = 0

    while (xi < canvas.width) {
      xi += grid
      ctx.moveTo(xi, 0)
      ctx.lineTo(xi, canvas.height)
    }

    ctx.closePath()
    ctx.stroke()
  }
  
  function DrawGround(y: number, h: number) {
    if (!ctx) { return }

    // ground
    const [groundTop, groundBottom] = GetGround()

    ctx.beginPath()
    ctx.strokeStyle = "#777"
    ctx.moveTo(0, groundTop)
    ctx.lineTo(canvas.width, groundTop)
    ctx.closePath()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.lineWidth = 1
    
    let xi = 0
    while (xi < canvas.width + 8) {
      ctx.moveTo(xi, groundTop)
      ctx.lineTo(xi - 8, groundBottom)
      
      xi += 5 
    }

    ctx.closePath()
    ctx.stroke()
  }
  
  function GetGround(): number[] {
    const groundTop = 85
    const groundBottom = groundTop + 7

    return [groundTop, groundBottom]
  }

  function DrawBody(x: number, color: string) {
    if (!ctx) { return }

    // get ground
    const groundTop = GetGround()[0]

    // wheels
    ctx.beginPath()
    ctx.strokeStyle = color;
    ctx.fillStyle = color
    ctx.fillStyle += "88"
    ctx.arc(x + wbody*2/7, groundTop - radius, radius, 0, 2*Math.PI)

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()

    ctx.strokeStyle = color;
    ctx.fillStyle += "88"
    ctx.arc(x + wbody*5/7, groundTop - radius, radius, 0, 2*Math.PI)

    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // box
    const y = groundTop - hbody - radius*2
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
  
  function DrawArrow(name: string, x: number, color: string) {
    if (!ctx) { return }

    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const [groundTop, groundBottom] = GetGround()
    const dy = 13

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

    // draw line bottom
    ctx.moveTo(x, groundBottom)
    ctx.lineTo(x, canvas.height)

    // draw arrow
    const y = canvas.height - dy
    const ddy = 7
    const ddx = 7

    ctx.moveTo(x, y)
    ctx.lineTo(x + 20, y)
    ctx.lineTo(x + 20 - ddx, canvas.height - dy - ddy)
    ctx.moveTo(x + 20, canvas.height - dy)
    ctx.lineTo(x + 20 - ddx, canvas.height - dy + ddy)
    ctx.closePath()
    ctx.stroke()
    
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.font = "20px monospace"
    ctx.fillText(name, x + 25, canvas.height - dy + 7)
  }
  
  function DrawU(x: number) {
    if (!ctx) { return }

    const y = 16
    const dx = 7
    const dy = 7

    const color = "#aaa"

    ctx.beginPath()

    ctx.strokeStyle = color
    ctx.lineWidth = 2

    ctx.moveTo(x, y)
    ctx.lineTo(x + 20, y)

    ctx.moveTo(x + 20, y)
    ctx.lineTo(x + 20 - dx, y - dy)
    ctx.moveTo(x + 20, y)
    ctx.lineTo(x + 20 - dx, y + dy)

    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = color
    ctx.font = "20px monospace"
    ctx.fillText("F", x + 25, y + 5)

  }

  function DrawRef(x: number) {
    if (!ctx) { return }
    
    ctx.strokeStyle = "#fccd9d"
    ctx.lineWidth = 3
    ctx.beginPath()
    
    const groundTop = GetGround()[0]

    const drie = 5
    ctx.moveTo(x-drie, 0)
    ctx.lineTo(x, drie)
    ctx.lineTo(x+drie, 0)

    ctx.lineWidth =  3
    let y = drie
    const spacing = 5
    const line =15
    
    while (y < groundTop) {
      y += spacing
      ctx.moveTo(x, y)
      y += line
      ctx.lineTo(x, y)
    }
    
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.clearRect(x-drie, groundTop, drie*2, drie*4)
    ctx.closePath()
    ctx.fill()

  }

  function Paint() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height); 

    const w = 40
    const dx1 = 100
    const dx2 = 200 + w
    
    const x1Block = dx1 + model.states.x1 * 10
    const x2Block = dx2 + model.states.x2 * 10

    DrawGrid()
    DrawRef(dx1 + model.m_setpoint * 10)
    DrawU(dx1)
    DrawGround(20, w)
    DrawSpring(0, x1Block, COLOR.BLUE)
    DrawDamper(0, x1Block, COLOR.BLUE)
    DrawSpring(x1Block + 40, x2Block, COLOR.PINK)
    DrawDamper(x1Block + 40, x2Block, COLOR.PINK)

    DrawArrow("x1", dx1, COLOR.BLUE)
    DrawArrow("x2", dx2, COLOR.PINK)

    DrawBody(x1Block, COLOR.BLUE);
    DrawBody(x2Block, COLOR.PINK);
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
  const controltype_btn = document.getElementById("controltype-btn");
  const controlstep_btn = document.getElementById("controlstep-btn");

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

  controltype_btn?.addEventListener("click", () => {
    ControlTypeFlip()
  });
  
  controlstep_btn?.addEventListener("click", () => {
    if (model.external_f < 0.5) {
      ControlStep(2.0)
    } else {
      ControlStep(0.0)
    }
  });
  
  function ControlStep(value: number) {

    if (!controlstep_btn) { return }

    model.external_f = value

    if (model.external_f > 0.3) {
      controlstep_btn.classList.remove('bg-sky-800')
      controlstep_btn.classList.add('bg-sky-900')
    } else {
      controlstep_btn.classList.add('bg-sky-800')
      controlstep_btn.classList.remove('bg-sky-900')
    }
  }

  function ControlTypeFlip() {
    if (!controltype_btn) { return }

    if (model.controltype == ControlType.LQR) {
      controltype_btn.innerText = "PID"
      model.controltype = ControlType.PID
    } else if (model.controltype == ControlType.PID) {
      controltype_btn.innerText = "LQR"
      model.controltype = ControlType.LQR
    }
  }
  
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
    
    // update type of controler
    if (controltype_btn) {
      controltype_btn.innerText = (model.controltype == ControlType.PID) ? "PID" : "LQR" 
    }
  }
  
  function Reset() {
    UpdateParams()
    model.t = 0.0
    model.reset(x1_0, x2_0, v1_0, v2_0, m1, m2, c, k);
    ControlON(false)
    ControlStep(0.0)

    stepn = 40;
    numel = 200;
    
    if (dataX1) {
      UpdateChart()
    }
  }
  
  function FitY() {
    max = Math.max(...dataX1)
    min = Math.min(...dataX1)
    console.log(`min: ${min}, max: ${max}`)
  }
  
  function ControlON(value:boolean) {
    if (!controlon_btn || !paramset_btn || !controltype_btn) { return }

    if (value) {
      controlon_btn.classList.remove("bg-red-800")
      controlon_btn.classList.add("bg-green-800")
      controlon_btn.innerText = "ON"

      model.m_controle_on = true
    } else {
      controlon_btn.classList.remove("bg-green-800")
      controlon_btn.classList.add("bg-red-800")
      controlon_btn.innerText = "OFF"

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

  model.controltype = ControlType.LQR

  let gain = [184.7561, 142.5969, -55.7884, 106.9744, -31.6228]
  // gain = [75.30, 46.25, -1.70, 38.44, -31.6228]
  gain = [150.3559, 101.3733, -21.1406,  81.9404, -44.7214]
  gain = [231.2085, 102.3687, -43.5301, 289.3857, -44.7214]

  model.klqr_x1 = gain[0]
  model.klqr_v1 = gain[1]
  model.klqr_x2 = gain[2]
  model.klqr_v2 = gain[3]
  model.klqr_i  = gain[4]
  
  console.log(model)

  UpdateParams()

  function play() {
    const fps = 100
    setTimeout(() => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (timer) {
        timer.innerText = `t: ${model.time().toFixed(1)}`;
      }

      model.stepn(stepn);
      
      Paint();
      UpdateChart()
      requestAnimationFrame(play);
    }, 1000 / fps);
  }

  play();

  Chart.register(...registerables);

  // Initialize an empty array for data
  const dataX1:number[] = Array.from({ length: numel }, () => 0);
  const dataX2:number[] = Array.from({ length: numel }, () => 0);
  const dataRef:number[] = Array.from({ length: numel }, () => 0);
  const labels:string[] = Array.from({ length: numel }, () => "0");
  
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
          data: dataRef,
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
  function UpdateChart() {
    
    const t  = Math.floor(model.time())
    const x1 = model.states.x1
    const x2 = model.states.x2
    const setp = model.m_setpoint

    dataX1.push(x1)
    dataX2.push(x2)
    dataRef.push(setp)
    labels.push(`${t}`)
    
    while (dataX1.length > numel) {
      dataX1.shift()
      dataX2.shift()
      dataRef.shift()
      labels.shift()
    }
    
    chart.data.datasets[0].data = dataX1
    chart.data.labels = labels

    max = Math.max(...dataX1, ...dataX2, max)
    min = Math.min(...dataX1, ...dataX2, min)
    
    if (chart.options.scales?.y) {
      chart.options.scales.y.max = max + 1
      chart.options.scales.y.min = min - 1
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