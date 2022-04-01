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
    
});

describe('invitationController findsByInvitedUser 테스트', () => {
    
});

describe('invitationController delete 테스트', () => {
    
});