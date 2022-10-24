export function sleep(ms) {
  return new Promise(resolve => {
    console.log(`${ms} sleep`);
    if(!ms) {
      throw Error(`ms: ${ms} 는 허용되지 않습니다.`);
    }
    setTimeout(resolve, ms);
  });
}
