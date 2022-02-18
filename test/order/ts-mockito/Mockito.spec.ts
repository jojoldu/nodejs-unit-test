import {
    anyFunction,
    anyNumber,
    anyOfClass,
    anyString,
    between,
    instance,
    mock,
    objectContaining,
    reset,
    when
} from 'ts-mockito';

class OrderService {
    getOrder(arg: any): any {}
}


describe('ts-mockito', () => {
    class TestClass {}
    const testFunction = () => true;

    let mockService: OrderService;
    beforeEach(() => {
        mockService = mock(OrderService);
    });

    afterEach(() => {
        reset(mockService);
    });

    it('when', () => {
        /** given **/
        // string
        when(mockService.getOrder(anyString())).thenReturn('anyString');
        when(mockService.getOrder('inflab')).thenReturn('inflab');

        // number
        when(mockService.getOrder(anyNumber())).thenReturn('anyNumber');
        when(mockService.getOrder(1)).thenReturn(1);

        // Class & Function
        when(mockService.getOrder(anyOfClass(TestClass))).thenReturn('TestClass');
        when(mockService.getOrder(anyFunction())).thenReturn('anyFunction');
        when(mockService.getOrder(testFunction)).thenReturn('testFunction');

        // 범위 조건
        when(mockService.getOrder(between(10, 20))).thenReturn('between 10 and 20');
        when(mockService.getOrder(objectContaining({ a: 1 }))).thenReturn('{ a: 1 }');

        /** when **/
        const service: OrderService = instance(mockService);

        /** then **/

        // string
        expect(service.getOrder('test')).toBe('anyString');
        expect(service.getOrder('inflab')).toBe('inflab');

        // number
        expect(service.getOrder(22)).toBe('anyNumber');
        expect(service.getOrder(1)).toBe(1);

        // Class & Function
        expect(service.getOrder(new TestClass())).toBe('TestClass');
        expect(service.getOrder(() => {})).toBe('anyFunction');
        expect(service.getOrder(testFunction)).toBe('testFunction');

        // 범위 조건
        expect(service.getOrder(19)).toBe('between 10 and 20');
        expect(service.getOrder({ b: 2, c: 3, a: 1 })).toBe('{ a: 1 }');
    });

    it('verify', () => {

    });

    it('capture', () => {

    });
});
