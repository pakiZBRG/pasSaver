const hashPassword = pass => {
    const M = +process.env.REACT_APP_MOVE_M;
    const N = +process.env.REACT_APP_MOVE_N;
    const place = process.env.REACT_APP_PLACE;

    const length = parseInt(pass.substring(place, place + 2));

    const hash = pass.length - length - 2;
    const aa = pass.slice(Math.ceil(hash - hash / 3 + 2), hash);

    const bb = aa.slice(0, length)

    const password = bb.split('');
    let i = password.length - 1;
    let j = 0;
    let asciiPass = [];
    while (i > -1) {
        const asciiChar = password[j].charCodeAt(0);
        if (i % 2 === 0) {
            asciiPass.push(asciiChar - M + i);
        } else {
            asciiPass.push(asciiChar - N + i);
        }
        i--;
        j++;
    }

    let stringPass = [];
    asciiPass.reverse().forEach(p => stringPass.push(String.fromCharCode(p)));
    return stringPass.join('');
}

export default hashPassword;