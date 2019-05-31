# Art Culture News Outlet
## Description
This repo contains source code for the *Art Culture News Outlet* created with Vuejs, Express, Mongodb, Nodejs. To replicate this project download or clone the repo and follow these steps:

1. Navigate to *client* directory and perform `npm install` to install the packages
2. Navigate to the *server* directory and perform `npm install` to install the packages
3. In both directores, (client, server) run the command `npm start`
3. Download and install mongodb and setup the db account
4. On mac edit the mongod.conf file `vim /usr/local/etc/mongod.conf` and copy the following contents to vim in terminal: 
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

## Screenshots
### Home Page
![Home Page](screenshots/screenshot1.png)

![Home Page 2](./screenshots/screenshot1.2.png)
![Home Page 3](./screenshots/screenshot1.3.png)
![Home Page 4](./screenshots/screenshot1.4.png)
<br>
### Side Bar
![Home Page 5](./screenshots/screenshot13.png)

<br><br>
### Tag View
![Tag View](./screenshots/screenshot4.png)

<br><br>
### Article View
![Article View](./screenshots/screenshot5.png)

<br><br>
### Admin View
![Admin View](./screenshots/screenshot6.png)
<br>

![Admin View 2](./screenshots/screenshot7.png)
<br>

![Admin View 3](./screenshots/screenshot8.png)

<br>
![Admin View 4](./screenshots/screenshot9.png)

<br>
![Admin View 5](./screenshots/screenshot10.png)

<br>
![Admin View 6](./screenshots/screenshot11.png)

<br>
![Admin View](./screenshots/screenshot12.png)


