#!/usr/bin/env node

const args = require("yargs").argv;
const Database = require("../Database");

if (!args.username) return console.error("Missing --username");
if (!args.password) return console.error("Missing --password");

const generate = async () => {
    const user = await Database.newUser({
        username: String(args.username),
        password: String(args.password)
    });

    if (user.ok) return console.log(`User Created.\nUsername: ${user.username}\nToken: ${user.token}`);
    return console.log(user.error);
};

return generate();
