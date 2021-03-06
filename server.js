/**
 * This example demonstrates setting up a webook, and receiving
 * updates in your express app
 */
/* eslint-disable no-console */

const TOKEN = process.env.TELEGRAM_TOKEN || '513805031:AAG27Li3yReG-2zGS6dYh-_yf_DsqgiHLPs';
const url = 'https://nexus10.herokuapp.com';
const port =  process.env.PORT || 8000;

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

let id = 211405073;

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', function () {
  client.subscribe('nexus10-test2')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  bot.sendMessage(id, message.toString());

})

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
// We are receiving updates at the route below!
app.get('*', (req, res) => {
  console.log('wadus')
  res.send();
});
// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

// Just to ping!
bot.on('message', msg => {
  client.publish('nexus10-test', JSON.stringify(msg))
  console.log('works !!!!!!!!!!!!!', msg);
  id = msg.chat.id;
  bot.sendMessage(msg.chat.id, 'I am alive!');
});
