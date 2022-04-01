const userModel = require('./user');

describe.skip('userModel 테스트', () => {
    test('쿼리 조회 0건 테스트', async () => {
        const id = 'testgood';
        const result = await userModel.findById(id);
        
        expect(result.status).toBe(400);
    });
    test('결과 조회 테스트', async () => {
        const id = 'ekwhwhek';
        const { status, data } = await userModel.findById(id);
        
        expect(status).toBe(200);
        expect(data.no).toBe(65);
        expect(data.id).toBe('ekwhwhek');
    });
})