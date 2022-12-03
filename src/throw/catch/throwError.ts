export function throwSyncError(id) {
  throw Error(`에러 발생 id=${id}`);
}

export async function throwAsyncError(id) {
  throw Error(`에러 발생 id=${id}`);
}
