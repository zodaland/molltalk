const httpMocks = require('node-mocks-http');
const invitationController = require('./invitationController');
const invitationModel = require('../../models/invitation');

jest.mock('../../models/invitation');

let req, res;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe('invitationController create 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof invitationController.create).toBe('function');
    });
    test('body.roomNo 인자값 오류 400 테스트', async () => {
        req.decoded = { no: 1 };
        req.body = { invitedUserNo: 1 };
        await invitationController.create(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('body.invitedUserNo 인자값 오류 400 테스트', async () => {
        req.doceded = { no: 1 };
        req.body = { roomNo: 1 };
        await invitationController.create(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('decoded.no 인자값 오류 400 테스트', async () => {
        req.body = { roomNo: 1, invitedUserNo: 1 };
        await invitationController.create(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('body.invitedUserNo, decoded.no 동일값 오류 400 테스트', async () => {
        req.decoded = { no: 1 };
        req.body = { roomNo: 1, invitedUserNo: 1 };
        await invitationController.create(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('invitationModel create 함수 호출, 상태값 204 테스트', async () => {
        const status = 204;
        req.decoded = { no: 1 };
        req.body = { roomNo: 1, invitedUserNo: 2 };
        invitationModel.create.mockReturnValue({ status });
        await invitationController.create(req, res);

        expect(invitationModel.create).toBeCalled();
        expect(res.statusCode).toBe(status);
    });
    test('invitationModel create 함수 호출, 상태값 201 테스트', async () => {
        const status = 201;
        req.decoded = { no: 1 };
        req.body = { roomNo: 1, invitedUserNo: 2 };
        invitationModel.create.mockReturnValue({ status });
        await invitationController.create(req, res);

        expect(invitationModel.create).toBeCalled();
        expect(res.statusCode).toBe(status);
    });
    test('invitationModel create 함수 호츨, 상태값 400 테스트', async () => {
        const status = 400;
        req.decoded = { no: 1};
        req.body = { roomNo: 1, invitedUserNo: 2 };
        invitationModel.create.mockReturnValue({ status });
        await invitationController.create(req, res);

        expect(invitationModel.create).toBeCalled();
        expect(res.statusCode).toBe(status);
    });
    test('invitationModel create 함수 호출, 에러 상태 500 테스트', async () => {
        req.decoded = { no: 1 };
        req.body = { roomNo: 1, invitedUserNo: 2 };
        invitationModel.create.mockReturnValue(Promise.reject());
        await invitationController.create(req, res);

        expect(invitationModel.create).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});

describe('invitationController findsByInvitedUser 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof invitationController.findsByInvitedUser).toBe('function');
    });
    test('decoded.no 인자값 오류 400 테스트', async () => {
        await invitationController.findsByInvitedUser(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('invitation findsByInvitedUser 호출 및 상태값 200 테스트', async () => {
        const status = 200;
        req.decoded = { no: 1 };
        invitationModel.findsByInvitedUser.mockReturnValue({ status });
        await invitationController.findsByInvitedUser(req, res);

        expect(invitationModel.findsByInvitedUser).toBeCalled();
        expect(res.statusCode).toBe(200);
    });
    test('invitation findsByInvitedUser 호출 및 에러 상태 500 테스트', async () => {
        req.decoded = { no: 1 };
        invitationModel.findsByInvitedUser.mockReturnValue(Promise.reject());
        await invitationController.findsByInvitedUser(req, res);

        expect(invitationModel.findsByInvitedUser).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});

describe('invitationController delete 테스트', () => {
    test('타입 테스트', () => {
        expect(typeof invitationController.delete).toBe('function');
    });
    test('body.no 인자값 오류 400 테스트', async () => {
        req.decoded = { no: 1 };
        await invitationController.delete(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('decoded.no 인자값 오류 400 테스트', async () => {
        req.body = { no: 1 };
        await invitationController.delete(req, res);

        expect(res.statusCode).toBe(400);
    });
    test('invitation delete 호출 및 상태값 400 테스트', async () => {
        const status = 400;
        req.decoded = { no: 1 };
        req.body = { no: 1 };
        invitationModel.delete.mockReturnValue({ status });
        await invitationController.delete(req, res);

        expect(invitationModel.delete).toBeCalled();
        expect(res.statusCode).toBe(status);
    });
    test('invitation delete 호출 및 200 상태값 테스트', async () => {
        const status = 200;
        req.decoded = { no: 1 };
        req.body = { no: 1 };
        invitationModel.delete.mockReturnValue({ status });
        await invitationController.delete(req, res);

        expect(invitationModel.delete).toBeCalled();
        expect(res.statusCode).toBe(status);
    });
    test('invitation delete 호출 및 에러 상태 500 테스트', async () => {
        req.decoded = { no: 1 };
        req.body = { no: 1 };
        invitationModel.delete.mockReturnValue(Promise.reject());
        await invitationController.delete(req, res);

        expect(invitationModel.delete).toBeCalled();
        expect(res.statusCode).toBe(500);
    });
});