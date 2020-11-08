### Flycam client

<img src="https://user-images.githubusercontent.com/46618410/66276031-fbdbd900-e88e-11e9-9643-efacecf1daff.png" width="30%">

#### WebAssembly Demo:
- [single-threaded](https://retroplasma.github.io/earth-client-demo/wasm/single-threaded/)
- [multi-threaded](https://retroplasma.github.io/earth-client-demo/wasm/multi-threaded/) (currently only works in Chrome due to SharedArrayBuffer)

Controls: Mouse, W, A, S, D and Shift key for boost

#### Build:

###### Native (tested on macOS):
- Fetch repo with submodules
- Have g++ sdl2, protobuf and glew installed.
- Build: `./build.sh`
- Run: `./main`

#### TODO:

```
- improve download order
- abort emscripten_fetch_close() https://emscripten.org/docs/api_reference/fetch.html
  and/or emscripten coroutine fetch semaphore	
- purge branches less aggressively	
- workers instead of shared mem https://emscripten.org/docs/api_reference/emscripten.h.html#worker-api	
```
