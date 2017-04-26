const { Markup } = require('telegraf');
const { Scene } = require('telegraf-flow');

//Don't forget to change .hears handler after modifying this array
const startKeyboardButtons = [
  ['🎤 Select artist', '##⃣  Select tag']
];

const startKeyboard = Markup
  .keyboard(startKeyboardButtons)
  .resize()
  .extra();

const startMenu = new Scene('startMenu');

startMenu.enter((ctx) => {
  ctx.reply('Hey! This bot can provide you interaction with Last.fm ' +
    'via Telegram. Try to press some of the buttons', startKeyboard);
})

startMenu.hears('🎤 Select artist', (ctx) => {
  ctx.flow.enter('artistWizard');
})
startMenu.hears('##⃣  Select tag', (ctx) => {
  ctx.reply('Sorry, this button does\'t work yet. But soon it will be!');
})

module.exports = startMenu;
