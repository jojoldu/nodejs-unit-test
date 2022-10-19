async function throwAsync(msg) {
  await null // need to await at least something to be truly async (see note #2)
  throw Error(msg)
}

async function returnWithAwait() {
  return await throwAsync('with all frames present')
}