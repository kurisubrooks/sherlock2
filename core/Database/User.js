const Sequelize = require("sequelize");
const Database = require("../Database");

const Users = Database.db.define("users", {
    admin: Sequelize.BOOLEAN,
    disabled: Sequelize.BOOLEAN,
    token: Sequelize.STRING,
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    permissions: Sequelize.STRING,
    data: Sequelize.STRING
});

Users.sync();

module.exports = Users;
