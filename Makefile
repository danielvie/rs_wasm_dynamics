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