const Sequelize = require('sequelize');
const Database = require('../Database');

const RegKeys = Database.db.define('regkeys', { key: Sequelize.STRING });

RegKeys.sync();

module.exports = RegKeys;
