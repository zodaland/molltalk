const mongoose = require('mongoose');
const mongodb = require('./mongodb');

jest.mock('mongoose');

describe('mongo test', () => {
    test('mongo connect test', async () => {
        mongoose.connect.mockReturnValue(Promise.resolve());
        const isConnect = await mongodb.connect();

        expect(isConnect).toBeTruthy();
    });

    test('mongo 연결 실패', async () => {
        mongoose.connect.mockReturnValue(Promise.reject());
        const isConnect = await mongodb.connect();

        expect(isConnect).toBeFalsy();
    });
    
    test('mongo close test', async () => {
        mongoose.connection = { close: () => Promise.resolve() };
        const isClose = await mongodb.close();

        expect(isClose).toBeTruthy();
    });

    test('mongo 해제 실패', async () => {
        mongoose.connection = { close: () => Promise.reject() };
        const isClose = await mongodb.close();

        expect(isClose).toBeFalsy();
    });
});