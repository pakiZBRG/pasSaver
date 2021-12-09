const hashPassword = pass => {
    const prefix = process.env.REACT_APP_PREFIX;
    const sufix = process.env.REACT_APP_SUFIX;
    const M = process.env.REACT_APP_MOVE_M;
    const N = process.env.REACT_APP_MOVE_N;
    const hash = pass.substring(prefix, pass.length - sufix);

    const password = hash.split('');
    let i = password.length - 1;
    let asciiPass = [];
    if(i % 2 === 0){
        while(i > -1){
            const asciiChar = password[i].charCodeAt(0);
            i % 2 === 0 ? asciiPass.push(asciiChar - M) : asciiPass.push(asciiChar - N);
            i--;
        }
    } else {
        while(i > -1){
            const asciiChar = password[i].charCodeAt(0);
            i % 2 === 0 ? asciiPass.push(asciiChar - N) : asciiPass.push(asciiChar - M);
            i--;
        }
    }
    
    let stringPass = [];
    asciiPass.forEach(p => stringPass.push(String.fromCharCode(p)));
    return stringPass.join('');
}

export default hashPassword;