(module
 (type $f64_=>_f64 (func (param f64) (result f64)))
 (memory $0 0)
 (export "factorial" (func $assembly/index/factorial))
 (export "memory" (memory $0))
 (func $assembly/index/factorial (param $0 f64) (result f64)
  local.get $0
  f64.const 1
  f64.eq
  local.get $0
  f64.const 0
  f64.eq
  i32.or
  if
   f64.const 1
   return
  end
  local.get $0
  local.get $0
  f64.const -1
  f64.add
  call $assembly/index/factorial
  f64.mul
 )
)
