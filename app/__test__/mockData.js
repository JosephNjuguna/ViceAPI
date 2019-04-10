const uniqueId = require('../helpers/common');
const datestring = require('../helpers/common');

const users = {
    user1: {
        name: '',
        email: 'test1@mail.com',
        password: 'Test123'
    },
    user2: {
        name: 'Jose',
        email: '',
        password: 'Test123'
    },
    user3: {
        name: 'Jose',
        email: 'test1@mail.com',
        password: ''
    },
    user4: {
        userid: uniqueId,
        name: 'Jose',
        email: 'test2@mail.com',
        password: 'qwerQ@qwerre123',
        signedup_on: datestring
    }
};

const userLogin = {
    user1: {
        email: 'test1@mail.com',
        password: 'Test123'
    }
}
module.exports = users;