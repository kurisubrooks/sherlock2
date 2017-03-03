const Sequelize = require("sequelize");
const Database = require("../Database");

const Users = Database.db.define("users", {
    disabled: Sequelize.BOOLEAN,
    admin: Sequelize.BOOLEAN,

    token: Sequelize.STRING,
    username: Sequelize.STRING,
    application: Sequelize.STRING,
    permissions: Sequelize.STRING,
    data: Sequelize.STRING
});

Users.sync();

module.exports = Users;
