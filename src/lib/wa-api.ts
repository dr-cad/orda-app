import { instantiateStreaming } from "@assemblyscript/loader";
export default instantiateStreaming(fetch("./wasm/as-api.wasm"));
