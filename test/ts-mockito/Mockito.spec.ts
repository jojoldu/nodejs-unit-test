import {
    anyFunction,
    anyNumber,
    anyOfClass,
    anyString, anything,
    between, capture,
    instance,
    mock,
    objectContaining,
    reset, verify,
    when
} from 'ts-mockito';

class OrderService {
    getOrder(arg: any): any {
        return arg;
    }
}

describe('ts-mockito', () => {
    class TestClass {}
    const testFunction = () => true;

    it('when', () => {
        /** given **/
        const mockService: OrderService = mock(OrderService);
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
        const mockService: OrderService = mock(OrderService);
        const service: OrderService = instance(mockService);

        service.getOrder(1);
        service.getOrder('test1');
        service.getOrder('test2');
        service.getOrder(10);

        // Call Count verify
        verify(mockService.getOrder(anyNumber())).times(2);
        verify(mockService.getOrder(anyString())).times(2);
        verify(mockService.getOrder(anything())).times(4);
        verify(mockService.getOrder(5)).never();
        verify(mockService.getOrder(10)).atLeast(1);

        // Call order verify
        verify(mockService.getOrder('test2')).calledBefore(mockService.getOrder(10));
        verify(mockService.getOrder(10)).calledAfter(mockService.getOrder('test2'));
    });

    it('capture', () => {
        const mockService: OrderService = mock(OrderService);
        const service: OrderService = instance(mockService);

        service.getOrder(1);
        service.getOrder(2);
        service.getOrder('test');
        service.getOrder({ a: 0 });

        expect(capture(mockService.getOrder).first()).toStrictEqual([1]);
        expect(capture(mockService.getOrder).byCallIndex(1)).toStrictEqual([2]);
        expect(capture(mockService.getOrder).beforeLast()).toStrictEqual(['test']);
        expect(capture(mockService.getOrder).last()).toStrictEqual([{ a: 0 }]);
    });
});
