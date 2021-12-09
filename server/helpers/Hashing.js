const generateSalt = length => {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

exports.hashPassword = pass => {
   pass = pass.split('');
   let i = pass.length - 1;
   let asciiPass = [];
   while(i > -1){
      const asciiChar = pass[i].charCodeAt(0);
      if(i % 2 == 0){
            asciiPass.push(asciiChar + parseInt(process.env.J));
      } else {
            asciiPass.push(asciiChar + parseInt(process.env.K));
      }
      i--;
   }

   const prefix = generateSalt(process.env.M);
   const sufix = generateSalt(process.env.N);

   let stringPass = [];
   asciiPass.forEach(p => stringPass.push(String.fromCharCode(p)));

   const hash = prefix + stringPass.join('') + sufix;
   return hash;
}