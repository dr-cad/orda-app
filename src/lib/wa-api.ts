import { instantiateStreaming } from "@assemblyscript/loader";
export default instantiateStreaming(fetch("./wasm/release.wasm"));
