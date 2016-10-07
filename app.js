var config = require('./config');
var http = require('http');
var bot = require('./modules/bot.js');
var tg = require('./modules/telegram/telegramAPI');

tg.setupWebhook();

http.createServer(function (req, res) {
    var body = '';

    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        if (req.url === config.BOT_WEBHOOK_PATH) {
            res.writeHead(200);
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.log(`Bad JSON: ${e.message}`);
                return;
            };
            bot.verifyMessage(body);
        } else {
            res.writeHead(401);
        }
        res.end();
    });

}).listen(config.SERVER_PORT);
