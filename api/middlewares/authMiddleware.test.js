const httpMocks = require('node-mocks-http');
const authMiddleware = require('./authMiddleware');
const userModel = require('../models/user');
const token = require('../library/token');

jest.mock('../models/user');
token.decode = jest.fn();
const next = jest.fn();

let req, res;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('authMiddleware 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof authMiddleware).toBe('function');
    });
    test('ip 누락 403 에러', async () => {
        req.cookies = { token: 'test' };
        await authMiddleware(req, res, next);
        
        expect(res.statusCode).toBe(403);
    });
    test('token 누락 403에러', async () => {
        req.headers = { 'x-real-ip': '123.123.123.123' };
        await authMiddleware(req, res, next);
        
        expect(res.statusCode).toBe(403);
    });
    test('OPTIONS 테스트', async () => {
        req.cookies = { token: 'test' };
        req.headers = { 'x-real-ip': '123.123.123.123' };
        req.method = 'OPTIONS';
        await authMiddleware(req, res, next);
        
        expect(res.statusCode).toBe(200);
    });
    test('token decode 함수 호출 및 에러 401, 쿠키 제거 테스트', async () => {
        req.cookies = { token: 'test' };
        req.headers = { 'x-real-ip': '123.123.123.123' };
        token.decode.mockReturnValue(Promise.reject());
        await authMiddleware(req, res, next);

        expect(token.decode).toBeCalled();
        expect(res.statusCode).toBe(401);
        expect(Object.keys(res.cookies)).toContain('token');
    });
    test('token decode 함수 호출, userModel.compareIp 호출 및 에러 401, 쿠키 제거 테스트', async () => {
        req.cookies = { token: 'test' };
        req.headers = { 'x-real-ip': '123.123.123.123' };
        token.decode.mockReturnValue({ no: 1 });
        userModel.compareIp.mockReturnValue(Promise.reject());
        await authMiddleware(req, res, next);
        
        expect(token.decode).toBeCalled();
        expect(userModel.compareIp).toBeCalled();
        expect(res.statusCode).toBe(401);
        expect(Object.keys(res.cookies)).toContain('token');
    });
    test('token decode 함수 호출, userModel.compareIp 호출 및200 아닌 값 에러 401, 쿠키 제거 테스트', async () => {
        req.cookies = { token: 'test' };
        req.headers = { 'x-real-ip': '123.123.123.123' };
        token.decode.mockReturnValue({ no: 1 });
        userModel.compareIp.mockReturnValue({ status: 401 });
        await authMiddleware(req, res, next);
        
        expect(token.decode).toBeCalled();
        expect(userModel.compareIp).toBeCalled();
        expect(res.statusCode).toBe(401);
        expect(Object.keys(res.cookies)).toContain('token');
    });
    test('token decode 함수 호출, userModel.compareIp 호출, next 호출 테스트', async () => {
        req.cookies = { token: 'test' };
        req.headers = { 'x-real-ip': '123.123.123.123' };
        token.decode.mockReturnValue({ no: 1 });
        userModel.compareIp.mockReturnValue({ status: 200 });
        await authMiddleware(req, res, next);
        
        expect(token.decode).toBeCalled();
        expect(userModel.compareIp).toBeCalled();
        expect(next).toBeCalled();
    });
});