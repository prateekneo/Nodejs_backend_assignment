let user = require('../Controller/User.js')
module.exports = (app) => {

    app.post('/create', user.create);
    app.get('/get/:userid', user.get);
    app.post('/edit', user.edit);
    app.post('/delete', user.del);
    app.get('/filter', user.filter);

}