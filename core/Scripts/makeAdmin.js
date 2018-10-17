#!/usr/bin/env node

const args = require("yargs").argv;
const Database = require("../Database");

if (!args.username) return console.error("Missing --username");

const generate = async() => {
    const user = await Database.changeAdmin(args.username, true);

    if (user.ok) return console.log("User Updated.");
    return console.log(user.error);
};

return generate();
