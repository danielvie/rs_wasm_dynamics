mod model;
use model::{Model, State};

use std::fs::File;
use std::io::{Write, Result};

fn main() -> Result<()> {
    let mut model = Model::new();
    model.states = State::from(4.0, 0.0, 3.0, -1.0);
    
    model.print();

    println!("initial t : {}", model.t);
    println!("initial x1: {}", model.states.x1);
    println!("initial x2: {}", model.states.x2);

    let mut file = File::create("output.csv")?;
    writeln!(&mut file, "t,x1,x2")?;

    while model.t < model.t_end {
        writeln!(&mut file, "{},{},{}", model.t, model.states.x1, model.states.x2)?;
        model.step();
    }

    println!("final t : {}", model.t);
    println!("final x1: {}", model.states.x1);
    println!("final x2: {}", model.states.x2);
    
    Ok(())
}

// cargo run

//    Compiling mass_sim_dynamics v0.1.0 (/Users/danielvieira/Sandbox/RUST/rs_sim_dynamics)
//     Finished dev [unoptimized + debuginfo] target(s) in 0.24s
//      Running `/Users/danielvieira/Sandbox/RUST/rs_sim_dynamics/target/debug/mass_sim_dynamics`
// m1:         1
// m2:         1
// k:          1
// c:          0.1
// _amp:       1
// _omega:     1
// dt:         0.01
// t:          0
// t_end       100
// _kp:        3
// _ki:        0.5
// _kd:        10
// _step_time: 2
// states:     State { x1: 4.0, x2: 0.0, v1: 3.0, v2: -1.0 }
// initial t : 0
// initial x1: 4
// initial x2: 0
// final t : 100.00000000001425
// final x1: -0.0038764351844958913
// final x2: -0.006258121052282443