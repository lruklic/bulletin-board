function getUserById(id) {
    for (var i = 0; i < state.users.length; i++) {
        if (state.users[i].uuid == id) {
            return state.users[i];
        }
    }
    return null;
}