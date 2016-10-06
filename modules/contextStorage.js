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
    context[userId] = {};
    context[userId].command = command;
    context[userId].stage = stage;
    if (!context[userId].parameters) {
        context[userId].parameters = [parameters];
    } else {
        context[userId].parameters.push(parameters);
    }
};

module.exports = context;
