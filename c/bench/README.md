WASM-Benchmarks
===============

Unfortunately, wasm benchmarks are not accurate nor similar
to C code or JS Code. The biggest difference comes from
WebAssembly type restrictions where we can only pass
wasm primitive types to wasm functions or directly manipulate the
memory from the JS.

Current approach is probably one of the worst, because it introduces
malloc to create/pass structs to the final who_took which is expecting
these structs to be cloned on stack. Malloc itself is not simple(at
least compared to the function we are benchmarking).

After we allocate memory then copy the data to the structs on the "heap",
another function takes these from heap, and copies them to "stack" and then
calls the original function.
I believe with this overhead, this benchmark is not worth doing.

### Potential alternatives?
  - We could potentially prepare all the memory manually(from JS) and not care
about stack/heap at all and use that for benchmarking, but the C API
is not designed with WASM in mind and easiest port to wasm is probably worst
that it could be.

  - We could use simpler general purpose malloc.
  - We could write custom malloc for the project ?
  - Create API that will receive many i32 args instead of PTRs making this
  malloc free.

### Notes

This function is part of the bigger project and if we had more
code in C and as small footprint as possible in JS, without need
to exchange "a lot of" data outside of the wasm we could probably
get much better results.

So, I will probably move wasm benchmarks into different project, that can
take advantage of WASM features more.
