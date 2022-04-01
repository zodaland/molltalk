const httpMocks = require('node-mocks-http');
const userController = require('./userController');
const userModel = require('../../models/user');

let req, res;
jest.mock('../../models/user');

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('userController 테스트', () => {
    test('check 타입 테스트', async () => {
        expect(typeof userController.findById).toBe('function');
    });
    test('인자값 누락 테스트', async () => {
        await userController.findById(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('params, decoded id값 동일 에러 테스트', async () => {
        req.params = { id: 'test' };
        req.decoded = { id: 'test' };
        
        await userController.findById(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    test('함수 호출 및 실패시 400 에러 테스트', async () => {
        const status = 400;
        req.params = { id: 'test' };
        req.decoded = { id: 'test1' };
        
        userModel.findById.mockReturnValue({ status });
        await userController.findById(req, res);
        
        expect(userModel.findById).toBeCalled();
        expect(res.statusCode).toBe(400);
    });
    test('에러 발생 500에러 테스트', async () => {
        req.params = { id: 'test' };
        req.decoded = { id: 'test1' };
        
        userModel.findById.mockReturnValue(Promise.reject());
        await userController.findById(req, res);
        
        expect(userModel.findById).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});