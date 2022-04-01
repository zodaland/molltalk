const userController = require('./authController');
const authModel = require('../../models/auth');
const httpMocks = require('node-mocks-http');

let req, res;

jest.mock('../../models/auth');

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});


describe('회원가입 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof userController.register).toBe('function');
    });
    test('인자 유효성 오류 400', async () => {
        await userController.register(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('authModel.create 호출 / 정상 status 테스트', async () => {
        authModel.create.mockReturnValue({ status: 200 });
        req.body = { id: 'test', password: 'test', name: 'test' };
        await userController.register(req, res);

        expect(authModel.create).toBeCalledWith(req.body);
        expect(res.statusCode).toBe(200);
    });
    test('에러 발생 status 500 테스트', async () => {
        authModel.create.mockReturnValue(Promise.reject());
        req.body = { id: 'test', password: 'test', name: 'test' };
        await userController.register(req, res);

        expect(authModel.create).toBeCalledWith(req.body);
        expect(res.statusCode).toBe(500);
    });
});

describe('로그인 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof userController.login).toBe('function');   
    });
    test('인자 유효성 오류 실패 상테 400 테스트', async () => {
        await userController.login(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('authModel.login 호출 / 실패 status 테스트', async () => {
        const status = 403
        req.body = { id: 'test', password: 'test' };
        authModel.login.mockReturnValue({ status });
        await userController.login(req, res);
        
        expect(authModel.login).toBeCalledWith(req.body);
        expect(res.statusCode).toBe(status);
    });
    test('authModel.login 호출 / 성공 status 테스트, 데이터 및 토큰 확인', async () => {
        const status = 201;
        const result = { data: { no: 1, id: 'test', name: 'test' }, token: 'test' };
        req.body = { id: 'test', password: 'test' };
        authModel.login.mockReturnValue({ status, result });
        await userController.login(req, res);

        expect(authModel.login).toBeCalledWith(req.body);
        expect(res.statusCode).toBe(status);
        expect(res._getJSONData()).toStrictEqual(result.data);
        expect(res.cookies.token.value).toBe(result.token);
    });
    test('에러발생 status 500 테스트', async () => {
        req.body = { id: 'test', password: 'test' };
        authModel.login.mockReturnValue(Promise.reject());
        await userController.login(req, res);

        expect(res.statusCode).toBe(500);
    });
});