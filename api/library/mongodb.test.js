const mongoose = require('./mongodb');

describe('mongo test', () => {
    test('mongo connect test', async () => {
        const isConnect = await mongoose.connect();

        expect(isConnect).toBeTruthy();
    });
    
    test('mongo close test', async () => {
        const isClose = await mongoose.close();

        expect(isClose).toBeTruthy();
    });
});