function foo() {
  const bar = { x: 1}, baz = bar.x;
  return bar;
}

function foo2() {
  const bar = {x: 1};
  doSomething(bar);
  return bar;
}

function doSomething(bar) {

}
