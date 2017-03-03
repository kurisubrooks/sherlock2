const Sequelize = require("sequelize");
const Database = require("../Database");

const Users = Database.db.define("users", {
    token: Sequelize.STRING,
    username: Sequelize.STRING,
    application: Sequelize.STRING,
    permissions: Sequelize.STRING,
    data: Sequelize.STRING,
    disabled: Sequelize.BOOLEAN
});

Users.sync();

module.exports = Users;
