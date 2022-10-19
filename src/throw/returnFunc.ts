async function throwAsync(msg) {
  await null // need to await at least something to be truly async (see note #2)
  throw Error(msg)
}

async function returnWithoutAwait () {
  return throwAsync('missing returnWithoutAwait in the stacktrace')
}