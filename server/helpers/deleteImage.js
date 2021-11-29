const fs = require('fs');

exports.deleteImage = filePath => {
    fs.unlink(filePath, err => {
        if(err){
            console.log(err);
        }
    })
}