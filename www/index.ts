import init, { sum, Model, State } from "mass_sim_dynamics";

init().then((_wasm) => {

    const worldWidth = 400;
    const worldHeight = 400;
    const canvas = document.getElementById('model-canvas') as HTMLCanvasElement
    canvas.height = worldHeight;
    canvas.width = worldWidth;
    const ctx = canvas.getContext("2d");
    
    function DrawBody() {
        if (!ctx) { return }

        ctx.roundRect(60,20,40,40,2)
        ctx.fillStyle = "#FF0000";

        ctx.fill()
    }
    
    DrawBody()



    function update() {
        const a_in = parseInt((document.getElementById('a-in') as HTMLInputElement).value)
        const b_in = parseInt((document.getElementById('b-in') as HTMLInputElement).value)
        const r = sum(a_in, b_in);
    }
    
    function RunAll() {
        while (model.t < model.t_end) {
            if (Math.abs(model.t%10.0) < 0.01) {
                PrintMsg()
            }
            model.step()
        }
    }
    
    function PrintMsg() {
        const msg = `t: ${model.t}\nx1: ${model.states.x1}, x2: ${model.states.x2}`
        console.log(msg)
    }
    
    const ok_btn = document.getElementById('ok-btn')
    ok_btn?.addEventListener('click', () => {
        PrintMsg()
        RunAll()
        PrintMsg()
    })
    
    let model    = Model.new()
    model.states = State.from(1.0,0.0,0.0,0.0)

    // function play() {
    //     setTimeout(() => {
    //         model.step()
    //         const msg = `${model.t}\n${model.states.x1}, ${model.states.x2}`
    //         if (res) {
    //             res.innerText = msg
    //         }
    //         play()
            
    //     }, 10);
    // }

    function play() {
      const fps = 3;
      setTimeout(() => {
        //   ctx?.clearRect(0, 0, canvas.width, canvas.height);
        model.step();
        //   paint();
        requestAnimationFrame(play);
      }, 1000 / fps);
    }
    
    play()
})