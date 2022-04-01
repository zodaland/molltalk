const httpMocks = require('node-mocks-http');
const roomController = require('./roomController');
const roomModel = require('../../models/room');

jest.mock('../../models/room');

let req, res;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('roomController create 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof roomController.create).toBe('function');
    });
    test('roomName값 누락 테스트', async () => {
        req.decoded = { no: 1 };
        await roomController.create(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('userNo값 누락 테스트', async () => {
        req.body = { name: 'test' };
        await roomController.create(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('model 함수 호출 및 201 정상 상태값 테스트', async () => {
        req.body = { name: 'test' };
        req.decoded = { no: 1 };
        roomModel.create.mockReturnValue({ status: 201 });
        await roomController.create(req, res);
        
        expect(roomModel.create).toBeCalled();
        expect(res.statusCode).toBe(201);
    });
    test('에러 발생 상태값 500 테스트', async () => {
        req.body = { name: 'test' };
        req.decoded = { no: 1 };
        roomModel.create.mockReturnValue(Promise.reject());
        await roomController.create(req, res);
        
        expect(roomModel.create).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});

describe('roomController findsByNo 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof roomController.findsByNo).toBe('function');
    });
    test('no 값 누락 테스트', async () => {
        await roomController.findsByNo(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('정상 값 리턴 테스트', async () => {
        req.decoded = { no: 1 };
        roomModel.findsByNo.mockReturnValue({ status: 200, data: [] });
        await roomController.findsByNo(req, res);
        
        expect(roomModel.findsByNo).toBeCalled();
        expect(res.statusCode).toBe(200);
    });
    test('에러 발생 상태값 500 테스트', async () => {
        req.decoded = { no: 1 };
        roomModel.findsByNo.mockReturnValue(Promise.reject());
        await roomController.findsByNo(req, res);
        
        expect(roomModel.findsByNo).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});