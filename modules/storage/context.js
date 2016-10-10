'use strict'

var context = {/* user id */};
//TODO: Replace with node-cache

/*Example:
{
    command: '/track',
    stage: 'askForTrack',
    parameters: [
        'Mike Oldfield'
    ]
}
*/

context.save = function (userId, command, stage) {
    if (!context[userId]) {
        context[userId] = {};
        context[userId].parameters = [];
    };
    context[userId].command = command;
    context[userId].stage = stage;
};

context.pushParameters = function (userId, parameters) {
    if (parameters) {
        return context[userId].parameters.push(parameters);
    };
}

context.pop = function (userId) {
    return context[userId].parameters.pop();
};

context.delete = function (userId) {
    delete context[userId];
};

module.exports = context;
