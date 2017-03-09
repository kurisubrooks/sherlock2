const Sequelize = require("sequelize");
const Database = require("../Database");

const Users = Database.db.define("users", {
    type: Sequelize.INTEGER,
    disabled: Sequelize.BOOLEAN,
    admin: Sequelize.BOOLEAN,

    token: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    applications: Sequelize.STRING,
    permissions: Sequelize.STRING,
    data: Sequelize.STRING
});

Users.sync();

module.exports = Users;
