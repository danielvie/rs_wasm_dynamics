use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum ControlType {
    LQR,
    PID
}

#[wasm_bindgen]
pub fn bla(control: ControlType) -> i32 { 
    let res = match control { 
        ControlType::LQR => 1,
        ControlType::PID => 12,
    };
    res
 }

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen(module = "/www/utils/consolelog.ts")]
extern "C" {
    fn consolelog(msg: String);
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
    pub m1: f64, pub m2: f64, pub k: f64, pub c: f64, _amp: f64, _omega: f64, pub dt: f64,
    pub t: f64, pub t_end: f64,
    _kp: f64, _ki: f64, _kd: f64,
    _step_time: f64,
    pub states: State,
    pub cont: i64,

    // controller
    pub external_f: f64,

    // pid
    m_integral: f64, m_prev_error: f64, pub m_setpoint: f64, pub m_controle_on: bool,
    pub m_dt: f64,
    pub m_ki: f64, pub m_kp: f64, pub m_kd: f64,
    pub controltype: ControlType,
    
    // lqr
    pub klqr_x1: f64,
    pub klqr_x2: f64,
    pub klqr_v1: f64,
    pub klqr_v2: f64,
    pub klqr_i: f64,

}

#[wasm_bindgen]
impl Model {
    pub fn new() -> Model {
        Model {
            m1: 1.0, m2: 1.0, k: 1.0, c: 0.1, _amp: 1.0, _omega: 1.0, dt: 0.01, t_end: 100.0, t: 0.0,
            _kp: 3.0, _ki: 0.5, _kd: 10.0,
            _step_time: 2.0,
            states: State::new(),
            cont: 0,

            external_f: 0.0,
            m_integral: 0.0, m_prev_error: 0.0, m_setpoint: 1.0, m_controle_on: false,
            m_dt: 0.01,
            m_ki: 1.0, m_kp: 0.0, m_kd: 0.0,
            controltype: ControlType::PID,
            klqr_x1: 485.43,
            klqr_x2: 458.34,
            klqr_v1: -268.18,
            klqr_v2: 277.26,
            klqr_i: -31.62,
        }
    }
    
    fn pid_compute(&mut self) -> f64 {
        let error:f64 = self.m_setpoint - self.states.x1;
        self.m_integral +=  error * self.m_dt;
        let derivative:f64 = -self.states.v1;
    
        let mut u:f64= self.m_kp * error + self.m_ki * self.m_integral + self.m_kd * derivative;
    
        self.m_prev_error = error;
        
        if self.m_controle_on == false {
            u = u * 0.0;
        }
    
        return u;
    }
    
    fn lqr_compute(&mut self) -> f64 {
        let error:f64    = self.m_setpoint - self.states.x1;
        
        if !self.m_controle_on {
            return 0.0;
        }

        self.cont += 1;

        // integral
        self.m_integral += (error + self.m_prev_error)/2.0 * self.m_dt;
        self.m_prev_error = error;

        let error_ki = -self.klqr_i * self.m_integral;

        // Use the Runge-Kutta method to update the integral
        // let prev_integral = self.m_integral;
        // let eval = error + self.m_prev_error;

        // let k1 = eval / 2.0 * self.m_dt;
        // let k2 = (eval / 2.0 + (eval + k1) / 2.0) * self.m_dt;
        // let k3 = (eval / 2.0 + (eval + k2) / 2.0) * self.m_dt;
        // let k4 = (eval + k3) * self.m_dt;

        // self.m_integral += (k1 + 2.0 * k2 + 2.0 * k3 + k4) / 6.0;

        // states
        let k_times_states = self.klqr_x1 * self.states.x1 + self.klqr_x2 * self.states.x2 + self.klqr_v1 * self.states.v1 + self.klqr_v2 * self.states.v2;
        let u = error_ki - k_times_states;
        
        if self.cont == 50 || self.cont == 51 || self.cont == 52 {
            let message = format!(
                "
                u: {}\n 
                ref: {}\n 
                error: {}\n 
                error_prev: {}\n 
                integral: {}\n 
                kstates: {}\n 
                klqr [x1, v1, x2, v2]: [{}, {}, {}, {}];\n
                states [x1, v1, x2, v2]: [{}, {}, {}, {}];\n
                ", 
                u, 
                self.m_setpoint,
                error,
                self.m_prev_error,
                self.m_integral,
                k_times_states, 
                self.klqr_x1, self.klqr_v1, self.klqr_x2, self.klqr_v2,
                self.states.x1, self.states.v1, self.states.x2, self.states.v2);
    
            consolelog(message);
        }

        if self.m_controle_on == false {
            return 0.0
        }
        u
    }
    
    fn compute_control(&mut self, controltype: ControlType) -> f64 {
        let u = match controltype {
            ControlType::PID => self.pid_compute(),
            ControlType::LQR => self.lqr_compute(),
        };
        u
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
    
    fn system_dynamics(&mut self, _t: f64, states: &State) -> State {
    
        // compute control
        let mut f1: f64 = 0.0;
        if self.m_controle_on {
            f1 = self.compute_control(self.controltype)
        }
        
        f1 += self.external_f;
        
        // emulate step reference signal
        // if (m_t > m_step_time) {
        //     m_pid->enable(true);
        // }
    

        // let deltax: f64 = states.x2 - states.x1;
        // let deltav: f64 = states.v2 - states.v1;
        
        // let a1: f64 = (-m_k*states.x1 - m_c*states.v1 + m_k*delta + m_c*(states.v2 - states.v1) + F1) / m_M1;
        // let a1: f64 = (-self.k*states.x1 - self.c*states.v1 + self.k*delta + self.c*(states.v2 - states.v1) + f1) / self.m1;

        let a1: f64 = (-2.0*self.k*self.states.x1 - 2.0*self.c*self.states.v1 + self.k*self.states.x2 + self.c*self.states.v2 + f1) / self.m1;
        let a2: f64 = (self.k*self.states.x1 + self.c*self.states.v1 - self.k*self.states.x2 - self.c*self.states.v2) / self.m2;
        
        State {x1: states.v1, x2: states.v2, v1: a1, v2: a2}
    }
    
    fn runge_kutta(&mut self, t: f64, states: &State) -> State {
    
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
        self.states = self.runge_kutta(self.t, &self.states.clone());
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
        self.m_integral = 0.0;
    }
}