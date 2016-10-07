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

context.save = function (userId, command, stage, parameters) {
    if (!context[userId]) {
        context[userId] = {};
    };
    context[userId].command = command;
    context[userId].stage = stage;
    if (parameters) {
        if (!context[userId].parameters) {
            context[userId].parameters = [];
        };
        context[userId].parameters.push(parameters);
    };
};

context.pop = function (userId) {
    return context[userId].parameters.pop();
};

context.delete = function (userId) {
    delete context[userId];
};

module.exports = context;
