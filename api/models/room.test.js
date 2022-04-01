const roomModel = require('./room');

test('findByNo 리턴값 테스트', async () => {
    const result = await roomModel.findsByNo(65);
    const objectNames = Object.keys(result)
    expect(objectNames).toContain('status');
    expect(objectNames).toContain('data');
});