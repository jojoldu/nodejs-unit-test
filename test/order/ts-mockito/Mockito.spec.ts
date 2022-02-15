import {
    anyFunction,
    anyNumber,
    anyOfClass,
    anyString,
    anything,
    between,
    instance,
    mock,
    objectContaining,
    when
} from 'ts-mockito';

class MyService {
    getFoo(arg: any): any {}
}


describe('ts-mockito', () => {
    class SpecificClass {}
    const specificFunction = () => true;

    let mockService: MyService;
    beforeEach(() => {
        mockService = mock(MyService);
    });

    it('when', () => {
        when(mockService.getFoo(anything())).thenReturn('anything');
        when(mockService.getFoo(anyString())).thenReturn('any other string');
        when(mockService.getFoo('bar')).thenReturn('bar');
        when(mockService.getFoo('baz')).thenReturn('baz');
        when(mockService.getFoo(anyNumber())).thenReturn('any number');
        when(mockService.getFoo(7)).thenReturn(7);
        when(mockService.getFoo(anyOfClass(SpecificClass))).thenReturn('SpecificClass instance was passed in');
        when(mockService.getFoo(anyFunction())).thenReturn('function');
        when(mockService.getFoo(specificFunction)).thenReturn('specificFunction');
        when(mockService.getFoo(between(13, 17))).thenReturn('between 13 and 17');
        when(mockService.getFoo(objectContaining({ a: 1 }))).thenReturn('object contains { a: 1 }');

        const service: MyService = instance(mockService);

        expect(service.getFoo('asdf')).toBe('any other string');
        expect(service.getFoo('bar')).toBe('bar');
        expect(service.getFoo('baz')).toBe('baz');
        expect(service.getFoo(22)).toBe('any number');
        expect(service.getFoo(7)).toBe(7);
        expect(service.getFoo(new SpecificClass())).toBe('SpecificClass instance was passed in')
        expect(service.getFoo(() => {})).toBe('function')
        expect(service.getFoo(specificFunction)).toBe('specificFunction')
        expect(service.getFoo(15)).toBe('between 13 and 17')
        expect(service.getFoo({ b: 2, c: 3, a: 1 })).toBe('object contains { a: 1 }')
        expect(service.getFoo({ b: 2, c: 3 })).toBe('anything');
    });

    it('verify', () => {

    });

    it('capture', () => {

    });
});
