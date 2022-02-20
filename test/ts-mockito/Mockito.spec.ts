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
        const methodStubVerificator1 = verify(service.getOrder(anyNumber()));
        methodStubVerificator1.times(1);
        verify(service.getOrder(anyString())).times(2);
        verify(service.getOrder(anything())).times(4);
        verify(service.getOrder(5)).never();

        verify(service.getOrder(10)).atLeast(1);

        // Call order verify
        verify(service.getOrder('test2')).calledBefore(service.getOrder(10));
        verify(service.getOrder(10)).calledAfter(service.getOrder('test2'));
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


    class Foo {
        getBar(num: number): any {
            return num;
        }
    }

    it('verify example', () => {
        // Creating mock
        let mockedFoo:Foo = mock(Foo);

        // Getting instance
        let service:Foo = instance(mockedFoo);

        // Some calls
        service.getBar(1);
        service.getBar(2);
        service.getBar(2);
        service.getBar(3);

        // Call count verification
        const methodStubVerificator = verify(mockedFoo.getBar(1));
        methodStubVerificator.once();               // was called with arg === 1 only once
        verify(mockedFoo.getBar(2)).twice();              // was called with arg === 2 exactly two times
        verify(mockedFoo.getBar(between(2, 3))).thrice(); // was called with arg between 2-3 exactly three times
        verify(mockedFoo.getBar(anyNumber())).times(4);    // was called with any number arg exactly four times
        verify(mockedFoo.getBar(2)).atLeast(2);           // was called with arg === 2 min two times
        verify(mockedFoo.getBar(anything())).atMost(4);   // was called with any argument max four times
        verify(mockedFoo.getBar(4)).never();
    });
});
