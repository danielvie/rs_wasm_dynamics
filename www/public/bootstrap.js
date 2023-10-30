/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../pkg/mass_sim_dynamics.js":
/*!***********************************!*\
  !*** ../pkg/mass_sim_dynamics.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Model: () => (/* binding */ Model),\n/* harmony export */   State: () => (/* binding */ State),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   greet: () => (/* binding */ greet),\n/* harmony export */   initSync: () => (/* binding */ initSync),\n/* harmony export */   sum: () => (/* binding */ sum)\n/* harmony export */ });\nlet wasm;\n\nconst cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );\n\nif (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };\n\nlet cachedUint8Memory0 = null;\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n/**\n* @param {number} a\n* @param {number} b\n* @returns {number}\n*/\nfunction sum(a, b) {\n    const ret = wasm.sum(a, b);\n    return ret;\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length, 1) >>> 0;\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len, 1) >>> 0;\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n\n        offset += ret.written;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n/**\n* @param {string} name\n*/\nfunction greet(name) {\n    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n    const len0 = WASM_VECTOR_LEN;\n    wasm.greet(ptr0, len0);\n}\n\nfunction _assertClass(instance, klass) {\n    if (!(instance instanceof klass)) {\n        throw new Error(`expected instance of ${klass.name}`);\n    }\n    return instance.ptr;\n}\n\nlet cachedInt32Memory0 = null;\n\nfunction getInt32Memory0() {\n    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {\n        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);\n    }\n    return cachedInt32Memory0;\n}\n/**\n*/\nclass Model {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(Model.prototype);\n        obj.__wbg_ptr = ptr;\n\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_model_free(ptr);\n    }\n    /**\n    * @returns {number}\n    */\n    get t() {\n        const ret = wasm.__wbg_get_model_t(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set t(arg0) {\n        wasm.__wbg_set_model_t(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {number}\n    */\n    get t_end() {\n        const ret = wasm.__wbg_get_model_t_end(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set t_end(arg0) {\n        wasm.__wbg_set_model_t_end(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {State}\n    */\n    get states() {\n        const ret = wasm.__wbg_get_model_states(this.__wbg_ptr);\n        return State.__wrap(ret);\n    }\n    /**\n    * @param {State} arg0\n    */\n    set states(arg0) {\n        _assertClass(arg0, State);\n        var ptr0 = arg0.__destroy_into_raw();\n        wasm.__wbg_set_model_states(this.__wbg_ptr, ptr0);\n    }\n    /**\n    * @returns {Model}\n    */\n    static new() {\n        const ret = wasm.model_new();\n        return Model.__wrap(ret);\n    }\n    /**\n    * @returns {string}\n    */\n    print() {\n        let deferred1_0;\n        let deferred1_1;\n        try {\n            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n            wasm.model_print(retptr, this.__wbg_ptr);\n            var r0 = getInt32Memory0()[retptr / 4 + 0];\n            var r1 = getInt32Memory0()[retptr / 4 + 1];\n            deferred1_0 = r0;\n            deferred1_1 = r1;\n            return getStringFromWasm0(r0, r1);\n        } finally {\n            wasm.__wbindgen_add_to_stack_pointer(16);\n            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);\n        }\n    }\n    /**\n    * @returns {number}\n    */\n    time() {\n        const ret = wasm.model_time(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    */\n    step() {\n        wasm.model_step(this.__wbg_ptr);\n    }\n    /**\n    * @param {number} n\n    */\n    stepn(n) {\n        wasm.model_stepn(this.__wbg_ptr, n);\n    }\n    /**\n    * @param {number} x1\n    * @param {number} x2\n    * @param {number} v1\n    * @param {number} v2\n    * @param {number} m1\n    * @param {number} m2\n    */\n    reset(x1, x2, v1, v2, m1, m2) {\n        wasm.model_reset(this.__wbg_ptr, x1, x2, v1, v2, m1, m2);\n    }\n}\n/**\n*/\nclass State {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(State.prototype);\n        obj.__wbg_ptr = ptr;\n\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_state_free(ptr);\n    }\n    /**\n    * @returns {number}\n    */\n    get x1() {\n        const ret = wasm.__wbg_get_state_x1(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set x1(arg0) {\n        wasm.__wbg_set_state_x1(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {number}\n    */\n    get x2() {\n        const ret = wasm.__wbg_get_state_x2(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set x2(arg0) {\n        wasm.__wbg_set_state_x2(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {number}\n    */\n    get v1() {\n        const ret = wasm.__wbg_get_state_v1(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set v1(arg0) {\n        wasm.__wbg_set_state_v1(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {number}\n    */\n    get v2() {\n        const ret = wasm.__wbg_get_state_v2(this.__wbg_ptr);\n        return ret;\n    }\n    /**\n    * @param {number} arg0\n    */\n    set v2(arg0) {\n        wasm.__wbg_set_state_v2(this.__wbg_ptr, arg0);\n    }\n    /**\n    * @returns {State}\n    */\n    static new() {\n        const ret = wasm.state_new();\n        return State.__wrap(ret);\n    }\n    /**\n    * @param {number} x1\n    * @param {number} x2\n    * @param {number} v1\n    * @param {number} v2\n    * @returns {State}\n    */\n    static from(x1, x2, v1, v2) {\n        const ret = wasm.state_from(x1, x2, v1, v2);\n        return State.__wrap(ret);\n    }\n}\n\nasync function __wbg_load(module, imports) {\n    if (typeof Response === 'function' && module instanceof Response) {\n        if (typeof WebAssembly.instantiateStreaming === 'function') {\n            try {\n                return await WebAssembly.instantiateStreaming(module, imports);\n\n            } catch (e) {\n                if (module.headers.get('Content-Type') != 'application/wasm') {\n                    console.warn(\"`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n\", e);\n\n                } else {\n                    throw e;\n                }\n            }\n        }\n\n        const bytes = await module.arrayBuffer();\n        return await WebAssembly.instantiate(bytes, imports);\n\n    } else {\n        const instance = await WebAssembly.instantiate(module, imports);\n\n        if (instance instanceof WebAssembly.Instance) {\n            return { instance, module };\n\n        } else {\n            return instance;\n        }\n    }\n}\n\nfunction __wbg_get_imports() {\n    const imports = {};\n    imports.wbg = {};\n    imports.wbg.__wbg_alert_ba0f4445c681a0d3 = function(arg0, arg1) {\n        alert(getStringFromWasm0(arg0, arg1));\n    };\n    imports.wbg.__wbindgen_throw = function(arg0, arg1) {\n        throw new Error(getStringFromWasm0(arg0, arg1));\n    };\n\n    return imports;\n}\n\nfunction __wbg_init_memory(imports, maybe_memory) {\n\n}\n\nfunction __wbg_finalize_init(instance, module) {\n    wasm = instance.exports;\n    __wbg_init.__wbindgen_wasm_module = module;\n    cachedInt32Memory0 = null;\n    cachedUint8Memory0 = null;\n\n\n    return wasm;\n}\n\nfunction initSync(module) {\n    if (wasm !== undefined) return wasm;\n\n    const imports = __wbg_get_imports();\n\n    __wbg_init_memory(imports);\n\n    if (!(module instanceof WebAssembly.Module)) {\n        module = new WebAssembly.Module(module);\n    }\n\n    const instance = new WebAssembly.Instance(module, imports);\n\n    return __wbg_finalize_init(instance, module);\n}\n\nasync function __wbg_init(input) {\n    if (wasm !== undefined) return wasm;\n\n    if (typeof input === 'undefined') {\n        input = new URL(/* asset import */ __webpack_require__(/*! mass_sim_dynamics_bg.wasm */ \"../pkg/mass_sim_dynamics_bg.wasm\"), __webpack_require__.b);\n    }\n    const imports = __wbg_get_imports();\n\n    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {\n        input = fetch(input);\n    }\n\n    __wbg_init_memory(imports);\n\n    const { instance, module } = await __wbg_load(await input, imports);\n\n    return __wbg_finalize_init(instance, module);\n}\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__wbg_init);\n\n\n//# sourceURL=webpack://www/../pkg/mass_sim_dynamics.js?");

/***/ }),

/***/ "./bootstrap.ts":
/*!**********************!*\
  !*** ./bootstrap.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nPromise.resolve().then(() => __importStar(__webpack_require__(/*! ./index */ \"./index.ts\"))).catch((e) => console.log(\"error importint index.ts\", e));\n\n\n//# sourceURL=webpack://www/./bootstrap.ts?");

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst mass_sim_dynamics_1 = __importStar(__webpack_require__(/*! mass_sim_dynamics */ \"../pkg/mass_sim_dynamics.js\"));\n(0, mass_sim_dynamics_1.default)().then((_wasm) => {\n    const worldWidth = 350;\n    const worldHeight = 100;\n    const canvas = document.getElementById('model-canvas');\n    canvas.height = worldHeight;\n    canvas.width = worldWidth;\n    const ctx = canvas.getContext(\"2d\");\n    const timer = document.getElementById('timer');\n    function DrawBody(x, y, w, h, r) {\n        if (ctx) {\n            ctx.clearRect(x, y, w, h); // Clear the area before drawing\n            ctx.beginPath();\n            ctx.moveTo(x + r, y);\n            ctx.lineTo(x + w - r, y);\n            ctx.quadraticCurveTo(x + w, y, x + w, y + r);\n            ctx.lineTo(x + w, y + h - r);\n            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);\n            ctx.lineTo(x + r, y + h);\n            ctx.quadraticCurveTo(x, y + h, x, y + h - r);\n            ctx.lineTo(x, y + r);\n            ctx.quadraticCurveTo(x, y, x + r, y);\n            ctx.closePath();\n            ctx.fillStyle = \"#2d61a1\";\n            ctx.fill();\n        }\n    }\n    function paint() {\n        DrawBody(100 + model.states.x1 * 10, 20, 40, 40, 2);\n        DrawBody(200 + model.states.x2 * 10, 20, 40, 40, 2);\n    }\n    function PrintMsg() {\n        const msg = `t: ${model.t}\\nx1: ${model.states.x1}, x2: ${model.states.x2}`;\n        console.log(msg);\n    }\n    let x1_0 = 1.0;\n    let x2_0 = 0.0;\n    let v1_0 = 0.0;\n    let v2_0 = 0.0;\n    let m1_0 = 1.0;\n    let m2_0 = 1.0;\n    const ok_btn = document.getElementById('ok-btn');\n    ok_btn === null || ok_btn === void 0 ? void 0 : ok_btn.addEventListener('click', () => {\n        x1_0 = parseFloat(document.getElementById('value-x1').value);\n        x2_0 = parseFloat(document.getElementById('value-x2').value);\n        m1_0 = parseFloat(document.getElementById('value-m1').value);\n        m2_0 = parseFloat(document.getElementById('value-m2').value);\n        model.reset(x1_0, x2_0, v1_0, v2_0, m1_0, m2_0);\n    });\n    document.addEventListener('keydown', (e) => {\n        switch (e.code) {\n            case \"Space\":\n                ok_btn === null || ok_btn === void 0 ? void 0 : ok_btn.click();\n                break;\n        }\n    });\n    let model = mass_sim_dynamics_1.Model.new();\n    model.states = mass_sim_dynamics_1.State.from(x1_0, x2_0, v1_0, v2_0);\n    function play() {\n        const fps = 100;\n        setTimeout(() => {\n            // Clear the canvas at the beginning of each frame\n            ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);\n            if (timer) {\n                timer.innerText = `timer: ${model.time()}`;\n            }\n            model.stepn(30);\n            paint();\n            requestAnimationFrame(play);\n        }, 1000 / fps);\n    }\n    play();\n});\n\n\n//# sourceURL=webpack://www/./index.ts?");

/***/ }),

/***/ "../pkg/mass_sim_dynamics_bg.wasm":
/*!****************************************!*\
  !*** ../pkg/mass_sim_dynamics_bg.wasm ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"862ef2a9bd2ac59bad35.wasm\";\n\n//# sourceURL=webpack://www/../pkg/mass_sim_dynamics_bg.wasm?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./bootstrap.ts");
/******/ 	
/******/ })()
;