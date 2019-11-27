# 7651331-Backend-Rest-Api
This repository contains my resturant ordering system project for 340CT Software Quality and Process Managment. The repo contains backend REST-Api code with unit tests written in <a href="https://jestjs.io/"> Jest Framework</a> and implements `Microservices` Architecture. The front-end part of this system is seprated into different repository <a href="https://github.coventry.ac.uk/340CT-1920SEPJAN/sareenv-frontend"> click to visit front-end repository </a> 


## Installing Dependencies

```
$ npm i --save
$ npm i --save-dev
```

## How to start Microservices.
```
 $ npm run microservices
```
In package.json I have added a script called microservices which links to `start.sh` shell script which stops any other program consuming the required ports and run each microservice with node in background mode.

## How to Run Unit Tests 
```
 $ jest --color
 or 
 $ npm run test
```
