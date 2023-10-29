mod model;
use model::{Model, State};

use std::fs::File;
use std::io::{Write, Result};

fn main() -> Result<()> {
    let mut model = Model::new();
    model.states = State::from(4.0, 0.0, 3.0, -1.0);

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

// error: failed to parse manifest at `/Users/danielvieira/Sandbox/RUST/rs_sim_dynamics/Cargo.toml`

// Caused by:
//   can't find library `mass_sim_dynamics`, rename file to `src/lib.rs` or specify lib.path