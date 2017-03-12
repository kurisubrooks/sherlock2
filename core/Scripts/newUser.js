#!/usr/bin/env node

const args = require("yargs").argv;
const Database = require("../Database");

if (!args.key) return console.error("Missing --key");
if (!args.username) return console.error("Missing --username");
if (!args.password) return console.error("Missing --password");
if (!args.email) return console.error("Missing --email");

const generate = async () => {
    const user = await Database.newUser({
        auth: String(args.key),
        email: String(args.email),
        username: String(args.username),
        password: String(args.password),
        admin: true
    });

    if (user.ok) return console.log(`User Created.\nUsername: ${user.username}\nToken: ${user.token}`);
    return console.log(user.error);
};

return generate();
