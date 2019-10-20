const usersMap = new Map();

module.exports = {
    getUser(id) {
        if (usersMap.has(id)) {
            return usersMap.get(id);
        }   else {
            throw Error('No user found');
        }
    },

    addUser(id, data) {
        usersMap.set(id, data);
    },

    doesUserExist(id) {
        return usersMap.has(id);
    }
}