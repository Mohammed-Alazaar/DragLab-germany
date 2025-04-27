const path = require('path');

module.exports = path.dirname(process.mainModule.filename); // This will give us the path to the main module which is app.js in this case. This is the path to the root folder of our project.