#!/usr/bin/env node

const args = require("yargs").argv;
const Database = require("../Database");

if (!args.token) return console.error("Missing --token");

const generate = async () => {
    const user = await Database.deleteUser({ token: args.token });
    return console.log(user);
};

return generate();
