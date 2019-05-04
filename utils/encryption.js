const bcrypt = require('bcryptjs');
const encryption ={
    gethash(plainText){
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainText,salt);
    },
    compare(plainText,hash){
        return bcrypt.compareSync(plainText,hash);
    }
}
module.exports = encryption;