use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
pub fn sum(a: i32, b: i32) -> i32 {
    a + b
}


#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(name);
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}


// model
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct State {
    pub x1: f64,
    pub x2: f64,
    pub v1: f64,
    pub v2: f64,
}

#[wasm_bindgen]
impl State {
    pub fn new() -> State {
       State { x1: 0.0, x2: 0.0, v1: 0.0, v2: 0.0 } 
    }

    pub fn from(x1:f64, x2:f64, v1:f64, v2:f64) -> State {
       State { x1, x2, v1, v2 } 
    }
}

#[wasm_bindgen]
pub struct Model {
    m1: f64, m2: f64, k: f64, c: f64, _amp: f64, _omega: f64, dt: f64, 
    pub t: f64, pub t_end: f64, 
    _kp: f64, _ki: f64, _kd: f64,
    _step_time: f64,
    pub states: State ,
}

#[wasm_bindgen]
impl Model {
    pub fn new() -> Model {
        Model {
            m1: 1.0, m2: 1.0, k: 1.0, c: 0.1, _amp: 1.0, _omega: 1.0, dt: 0.01, t_end: 100.0, t: 0.0,
            _kp: 3.0, _ki: 0.5, _kd: 10.0,
            _step_time: 2.0,
            states: State::new(),
        }
    }
    
    pub fn print(&self) -> String {
        format!("m1:         {}\n\
                 m2:         {}\n\
                 k:          {}\n\
                 c:          {}\n\
                 _amp:       {}\n\
                 _omega:     {}\n\
                 dt:         {}\n\
                 t:          {}\n\
                 t_end:      {}\n\
                 _kp:        {}\n\
                 _ki:        {}\n\
                 _kd:        {}\n\
                 _step_time: {}\n\
                 states:     {:?}",
                self.m1, self.m2, self.k, self.c, self._amp, self._omega, self.dt, self.t,
                self.t_end, self._kp, self._ki, self._kd, self._step_time, self.states)
    }
    
    pub fn time(&self) -> f64 {
        (self.t * 100.0).round() / 100.0
    }

    fn system_dynamics(&self, _t: f64, states: &State) -> State {
        let delta: f64 = states.x2 - states.x1;
    
        // let ref_: f64 = 1.0;
        // let F1: f64 = m_pid->compute(ref, states);
        
        // emulate step reference signal
        // if (m_t > m_step_time) {
        //     m_pid->enable(true);
        // }
    
        // let a1: f64 = (-m_k*states.x1 - m_c*states.v1 + m_k*delta + m_c*(states.v2 - states.v1) + F1) / m_M1;
        let a1: f64 = (-self.k*states.x1 - self.c*states.v1 + self.k*delta + self.c*(states.v2 - states.v1)) / self.m1;
        let a2: f64 = (-self.k*delta - self.c*(states.v2 - states.v1)) / self.m2;
        
        State {x1: states.v1, x2: states.v2, v1: a1, v2: a2}
    }
    
    fn runge_kutta(&self, t: f64, states: &State) -> State {
    
        let dt: f64 = self.dt;
        let k1: State = self.system_dynamics(t, states);
        let k2: State = self.system_dynamics(t + 0.5*dt, &State::from(states.x1 + 0.5*dt*k1.x1, states.x2 + 0.5*dt*k1.x2, states.v1 + 0.5*dt*k1.v1, states.v2 + 0.5*dt*k1.v2));
        let k3: State = self.system_dynamics(t + 0.5*dt, &State::from(states.x1 + 0.5*dt*k2.x1, states.x2 + 0.5*dt*k2.x2, states.v1 + 0.5*dt*k2.v1, states.v2 + 0.5*dt*k2.v2));
        let k4: State = self.system_dynamics(t + dt, &State::from(states.x1 + dt*k3.x1, states.x2 + dt*k3.x2, states.v1 + dt*k3.v1, states.v2 + dt*k3.v2));
        
        State::from (
            states.x1 + dt/6.0 * (k1.x1 + 2.0*k2.x1 + 2.0*k3.x1 + k4.x1),
            states.x2 + dt/6.0 * (k1.x2 + 2.0*k2.x2 + 2.0*k3.x2 + k4.x2),
            states.v1 + dt/6.0 * (k1.v1 + 2.0*k2.v1 + 2.0*k3.v1 + k4.v1),
            states.v2 + dt/6.0 * (k1.v2 + 2.0*k2.v2 + 2.0*k3.v2 + k4.v2)
        )
    }
    
    pub fn step(&mut self) {
        self.states = self.runge_kutta(self.t, &self.states);
        self.t += self.dt;
    }
    
    pub fn stepn(&mut self, n: i32) {
        for _ in 0..n {
            self.step();
        }
    }
    
    pub fn reset(&mut self, x1:f64, x2:f64, v1:f64, v2:f64, m1:f64, m2:f64, c:f64, k:f64) {
        self.t = 0.0;
        self.states = State::from(x1, x2, v1, v2);
        self.m1 = m1;
        self.m2 = m2;
        self.c = c;
        self.k = k;
    }
}