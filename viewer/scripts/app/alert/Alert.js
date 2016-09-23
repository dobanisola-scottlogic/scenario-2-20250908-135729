const AlertTypes = require('./AlertTypes');

module.exports = {
    Success: {
        type: AlertTypes.SUCCESS,
        message: 'Operation was successful.'
    },
    Error: {
        type: AlertTypes.ERROR,
        message: 'A problem occurred.'
    }
};
