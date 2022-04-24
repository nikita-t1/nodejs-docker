const Sequelize = require('sequelize')

const sequelizeInstance = new Sequelize(
  process.env.PGDATABASE || "postgres",
  process.env.PGUSER  || "postgres",
  process.env.PGPASSWORD || "admin",
  {
    host: process.env.PGHOST || "localhost",
    dialect: 'postgres',
  },
);

const Release = sequelizeInstance.define('releases', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    categories: {
      type: Sequelize.ARRAY(Sequelize.DataTypes.TEXT),
    },
    pubDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    nfo: {
      type: Sequelize.DataTypes.STRING(2048),
      allowNull: false,
    },
    content: {
      type: Sequelize.DataTypes.STRING(2048),
      allowNull: false,
    },
    download_link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false
  }
)

export default {sequelizeInstance, Release};