const generateSalt = length => {
   const result = [];
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[];:,.<>/?\|"';
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
   while (i > -1) {
      const asciiChar = pass[i].charCodeAt(0);
      if (i % 2 == 0) {
         asciiPass.push(asciiChar + +process.env.J - i);
      } else {
         asciiPass.push(asciiChar + +process.env.K - i);
      }
      i--;
   }

   const fixedLength = 112.5 - pass.length;

   const prefix = generateSalt(Math.ceil(fixedLength - fixedLength / process.env.M));
   const sufix = generateSalt(Math.floor(fixedLength - fixedLength / process.env.N * 2));

   let stringPass = [];
   asciiPass.forEach(p => stringPass.push(String.fromCharCode(p)));

   let length = pass.length.toString();
   if(length.length === 1) {
      length = `0${length}`;
   }

   let hash = prefix + stringPass.join('') + sufix;
   hash = hash.slice(0, process.env.PLACE) + length + hash.slice(process.env.PLACE)
   return hash;
}