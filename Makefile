all: b

i:
	cargo init

r:
	cargo run

b:
	wasm-pack build --target web
	
p: plot

plot:
	cargo run
	python plot.py
	
bw:
	emcc -Ic_wasm/lib c_wasm/lib/add.c c_wasm/bla/invert.c c_wasm/lib/invert_matrix.c -o www/public/add.wasm -s EXPORTED_FUNCTIONS="['_add', '_invert', '_malloc', '_free', '_invert_matrix']" --no-entry