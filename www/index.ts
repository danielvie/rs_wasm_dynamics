import init, { sum, Model, State } from "mass_sim_dynamics";

init().then((_wasm) => {

    const worldWidth = 400;
    const worldHeight = 400;
    const canvas = document.getElementById('model-canvas') as HTMLCanvasElement
    canvas.height = worldHeight;
    canvas.width = worldWidth;
    const ctx = canvas.getContext("2d");
    
    const timer = document.getElementById('timer')

    function DrawBody(x:number, y:number, w:number, h:number, r:number) {
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
        DrawBody(100 + model.states.x1*10,20,40,40,2)
        DrawBody(200 + model.states.x2*10,20,40,40,2)
    }

    function PrintMsg() {
        const msg = `t: ${model.t}\nx1: ${model.states.x1}, x2: ${model.states.x2}`
        console.log(msg)
    }
    
    let x1_0 = 1.0;
    let x2_0 = 0.0;
    let v1_0 = 0.0;
    let v2_0 = 0.0;
    
    const ok_btn = document.getElementById('ok-btn')
    ok_btn?.addEventListener('click', () => {
        x1_0 = parseFloat((document.getElementById('value-x1') as HTMLInputElement).value);
        model.reset(x1_0, x2_0, v1_0, v2_0)
    })
    
    document.addEventListener('keydown', (e) => {

      switch (e.code) {
        case "Space":
            ok_btn?.click()
            break;
      }

    })
    
    let model    = Model.new()
    model.states = State.from(x1_0, x2_0, v1_0, v2_0)

    function play() {
      const fps = 100;
      setTimeout(() => {
        // Clear the canvas at the beginning of each frame
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        if (timer) {
          timer.innerText = `timer: ${model.time()}`;
        }

        model.stepn(30)
        paint()

        requestAnimationFrame(play);
      }, 1000 / fps);
    }
    
    play()
})