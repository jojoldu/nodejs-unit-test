import faker from '@faker-js/faker';

describe('현실적인 Given 데이터 사용하기', () => {
  it('[거짓성공] 규칙에 맞는 이름을 등록하면 성공한다', () => {
    const addProductResult = addProduct("test");
    expect(addProductResult).toBe(true);
  });

  it.skip('[실패] 규칙에 맞는 이름을 등록하면 성공한다', () => {
    const addProductResult = addProduct("te st");
    expect(addProductResult).toBe(true);
  });

  it.skip('[실패] 유효한 값이 추가되면 성공한다', () => {
    const addProductResult = addProduct(faker.commerce.productName(), faker.random.number());
    //생성된 무작위 인풋: {'Sleek Cotton Computer',  85481}
    expect(addProductResult).toBe(true);
  });
});

function addProduct(name:string, number?: number) {
  // 공백을 허용하지 않은 정규식
  const productNameRegexNoSpace = /^\S*$/;

  if(!productNameRegexNoSpace.test(name)) {
    return false;
  }

  return true;
}
