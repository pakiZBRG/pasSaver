import jwt from 'jsonwebtoken';

export const authenticate = (res) => {
    const email = jwt.decode(res.data.token).email;
    localStorage.setItem('keyPass', JSON.stringify(email));
}


export const isAuth = () => {
    const loggedUser = localStorage.getItem('keyPass');
    if(loggedUser){
        return JSON.parse(loggedUser);
    } else {
        return false;
    }
}

export const signout = next => {
    localStorage.removeItem('user');
    next();
}