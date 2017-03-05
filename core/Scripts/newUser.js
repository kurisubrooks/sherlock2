#!/usr/bin/env node

const args = require("yargs").argv;
const Database = require("../Database");

if (!args.username) return console.error("Missing --username");

const generate = async () => {
    const user = await Database.newUser({ username: args.username.toLowerCase() });
    if (user.ok) return console.log(`User Created.\nAuthor: ${user.username}\nUser Token: ${user.token}`);
    return console.log(user.error);
};

return generate();
