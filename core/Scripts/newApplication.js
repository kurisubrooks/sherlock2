#!/usr/bin/env node

const args = require('yargs').argv;
const Database = require('../Database');

if (!args.token) return console.error('Missing --token');
if (!args.name) return console.error('Missing --name');
if (!args.description) return console.error('Missing --description');
if (!args.url) return console.error('Missing --url');

const generate = async() => {
  const application = await Database.newApplication({
    token: args.token,
    name: args.name,
    description: args.description,
    url: args.url
  });

  if (application.ok) return console.log(`Application Created.\nAuthor: ${application.username}\nApplication Name: ${application.name}\nApplication Description: ${application.description}\nApplication URL: ${application.url}`);
  return console.log(application.error);
};

return generate();
