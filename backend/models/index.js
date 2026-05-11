const sequelize = require('../config/db');
const User = require('./User');
const Sector = require('./Sector');
const { Session, Startup, Aceleradora, Inversor } = require('./Profiles');
const { Geolocalizacion, ConexionGrafo, Solicitud, MetricaDashboard } = require('./Ecosystem');
const { Mensaje, ConsultaIA } = require('./Communication');

const db = {
  sequelize,
  User,
  Sector,
  Session,
  Startup,
  Aceleradora,
  Inversor,
  Geolocalizacion,
  ConexionGrafo,
  Solicitud,
  MetricaDashboard,
  Mensaje,
  ConsultaIA
};

module.exports = db;
