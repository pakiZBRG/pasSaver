import jwt from 'jsonwebtoken';

export const authenticate = (res) => {
    const id = jwt.decode(res.data.token).id;
    localStorage.setItem('id', JSON.stringify(id));
}

export const isAuth = () => {
    const loggedUser = localStorage.getItem('id');
    if(loggedUser){
        return JSON.parse(loggedUser);
    } else {
        return false;
    }
}

export const signout = next => {
    localStorage.removeItem('id');
    localStorage.removeItem('editable');
    next();
}