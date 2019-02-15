module.exports = {
  port: process.env.PORT || 8081,
  db: {
      database: process.env.DB_NAME || 'personalblog',
      user: process.DB_USER || 'personalblog',
      password: process.env.DB_PASS || 'personalblog',
      options: {
          dialect: process.env.DIALECT || 'sqlite',
          host: process.env.HOST || 'localhost',
          storage: './personalblog.sqlite',
          operatorsAliases: false
      }
  },
  authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}