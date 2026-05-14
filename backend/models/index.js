const sequelize = require('../config/db');

const User = require('./User');
const Role = require('./Role');
const Sector = require('./Sector');
const Startup = require('./Startup');
const Session = require('./Session');
const Aceleradora = require('./Aceleradora');
const Inversor = require('./Inversor');
const { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard } = require('./Ecosystem');
const { Mensaje, ConsultaIA } = require('./Communication');

module.exports = {
  sequelize,
  User,
  Role,
  Sector,
  Startup,
  Session,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA
};
