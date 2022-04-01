const httpMocks = require('node-mocks-http');
const roomUserController = require('./roomUserController');
const roomUserModel = require('../../../models/roomUser');

jest.mock('../../../models/roomUser');

let req, res;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('roomUserController create 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof roomUserController.create).toBe('function');
    });
    test('body.no 인자 누락 400상태 테스트', async () => {
        req.decoded = { no: 1 };
        await roomUserController.create(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('decoded.no 인자 누락 400상태 테스트', async () => {
        req.body = { no: 1 };
        await roomUserController.create(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('model create 함수 호출 및 403 상태 테스트', async () => {
        req.body = { no: 1 };
        req.decoded = { no: 1 };
        roomUserModel.create.mockReturnValue({ status: 403 });
        await roomUserController.create(req, res);
        
        expect(roomUserModel.create).toBeCalled();
        expect(res.statusCode).toBe(403);
    });
    test('model create 함수 호출 및 201 상태 테스트', async () => {
        req.body = { no: 1 };
        req.decoded = { no: 1 };
        roomUserModel.create.mockReturnValue({ status: 201 });
        await roomUserController.create(req, res)
        
        expect(roomUserModel.create).toBeCalled();
        expect(res.statusCode).toBe(201);
    });
    test('에러 발생 500상태 테스트', async () => {
        req.body = { no: 1 };
        req.decoded = { no: 1 };
        roomUserModel.create.mockReturnValue(Promise.reject());
        await roomUserController.create(req, res);
        
        expect(roomUserModel.create).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});

describe('roomUserController findRoomUsers 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof roomUserController.create).toBe('function');
    });
    test('decoded.no 인자 누락 400상태 테스트', async () => {
        await roomUserController.create(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('model findRoomUsers 함수 호출 및 200 상태 테스트', async () => {
        req.decoded = { no: 1 };
        roomUserModel.findRoomUsers.mockReturnValue({ status: 200, data: [] });
        await roomUserController.findRoomUsers(req, res);
        
        expect(roomUserModel.findRoomUsers).toBeCalled();
        expect(res.statusCode).toBe(200);
    });
    test('에러 발생 500상태 테스트', async () => {
        req.decoded = { no: 1 };
        roomUserModel.findRoomUsers.mockReturnValue(Promise.reject());
        await roomUserController.findRoomUsers(req, res);
        
        expect(res.statusCode).toBe(500);
    });
});

describe('roomUserController delete 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof roomUserController.delete).toBe('function');
    });
    test('params.no 인자 누락 400 상태 테스트', async () => {
        req.decoded = { no: 1 };
        await roomUserController.delete(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('decoded.no 인자 누락 400 상태 테스트', async () => {
        req.params = { no: 1 };
        await roomUserController.delete(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('model delete 함수 호출 및 200 상태 테스트', async () => {
        req.params = { no: 1 };
        req.decoded = { no: 1 };
        roomUserModel.delete.mockReturnValue({ status: 200 });
        await roomUserController.delete(req, res);
        
        expect(roomUserModel.delete).toBeCalled();
        expect(res.statusCode).toBe(200);
    });
    test('에러 발생 500 상태 테스트', async () => {
        req.params = { no: 1 };
        req.decoded = { no: 1 };
        roomUserModel.delete.mockReturnValue(Promise.reject());
        await roomUserController.delete(req, res);
        
        expect(roomUserModel.delete).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});