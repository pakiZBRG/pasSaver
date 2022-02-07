import jwt from 'jsonwebtoken';

export const authenticate = (res) => {
    const id = jwt.decode(res.data.token).id;
    localStorage.setItem('id', JSON.stringify(id));
    const users = []
    
    const saveUsers = JSON.parse(localStorage.getItem('savedUsers'));
    if(!saveUsers) {
        users.push(id)
        localStorage.setItem('savedUsers', JSON.stringify(users))
    } else {
        const inUsers = saveUsers.includes(id);
        if(!inUsers) {
            saveUsers.push(id)
            localStorage.setItem('savedUsers', JSON.stringify(saveUsers));
        }
    }
}

export const isAuth = () => {
    const loggedUser = localStorage.getItem('id');
    if(loggedUser){
        return JSON.parse(loggedUser);
    } else {
        return false;
    }
}

export const deactivate = next => {
    localStorage.removeItem('editable');
    next();
}

export const signout = next => {
    localStorage.removeItem('id');
    localStorage.removeItem('editable');
    next();
}