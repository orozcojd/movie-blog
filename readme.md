# Personal Blog
## Description
This repo holds a personal blog created with Vuejs, Express, Mongodb, Nodejs. To replicate this project download or clone the repo and follow these steps:

1. Navigate to *client* directory and perform `npm install` to install the packages
2. Navigate to the *server* directory and perform `npm install` to install the packages
3. In both directores, (client, server) run the command npm start
3. Download and install mongodb
4. On mac run the command and copy the following contents to vim in terminal: `vim /usr/local/etc/mongod.conf`
```
systemLog:
	destination: file
path: /usr/local/var/log/mongodb/mongo.log
	logAppend: true
storage:
	dbPath: /usr/local/var/mongodb
net:
	bindIp: 127.0.0.1
```
5. To start mongodb run: `brew services start mongodb` or run `mongodb --dbpath "/usr/local/var/mongodb"`