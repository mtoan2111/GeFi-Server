# Welcome to Home Service

Steps to run this project:
### Install all prerequisite

install node modules

```sh
npm i
npm i -g nodemon typedoc typescript
```

install PostgresSQL

* Windows
```
https://www.postgresql.org/download/windows/
```

* Linux
```
https://www.postgresql.org/download/
```

* macOSX
```
https://www.postgresql.org/download/macosx/
```

install Visual studio code
```
https://code.visualstudio.com/download
```

### Config Database connection

update your connection in `.env` file

```sh
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DATABASE=service_home
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Abcxyz !@#123
```

### Migration database

```sh
node --require ts-node/register ./node_modules/typeorm/cli.js migration:run
```

### Generate docs

```sh
npx typedoc
```

### Run project

```sh
nodemon
```

### Swagger API 
```sh
https://localhost:7000/docs/
```

# Project structure
```
.
├── babel.config.js
├── cli.sh
├── docker
│   ├── docker-compose.yml
│   └── init.sql
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── draw <-- Flow Diagram
│   ├── database <-- Design of database
│   │   ├── database.drawio
│   │   ├── database.drawio.svg
│   │   └── database.png
│   └── major <-- List of major in project
│       ├── Area <-- Major
│       │   ├── Create
│       │   │   ├── Create.drawio
│       │   │   ├── Create.drawio.svg
│       │   │   └── Create.png
│       │   ├── Delete
│       │   │   ├── Delete.drawio
│       │   │   ├── Delete.drawio.svg
│       │   │   └── Delete.png
│       │   └── Update
│       │       ├── Update.drawio
│       │       ├── Update.drawio.svg
│       │       └── Update.png
│       ├── Entity
│       │   ├── Delete
│       │   │   ├── Delete.drawio
│       │   │   ├── Delete.drawio.svg
│       │   │   └── Delete.png
│       │   ├── Register
│       │   │   ├── Register.drawio
│       │   │   ├── Register.drawio.svg
│       │   │   └── Register.png
│       │   ├── Share
│       │   │   └── Share.drawio.svg
│       │   ├── Update
│       │   │   ├── Update.drawio
│       │   │   ├── Update.drawio.svg
│       │   │   └── Update.png
│       │   └── Verify
│       │       ├── Verify.drawio
│       │       ├── Verify.drawio.svg
│       │       └── Verify.png
│       ├── Home
│       │   ├── Create
│       │   │   ├── Create.drawio
│       │   │   ├── Create.drawio.svg
│       │   │   └── Create.png
│       │   ├── Delete
│       │   │   ├── Delete.drawio
│       │   │   ├── Delete.drawio.svg
│       │   │   └── Delete.png
│       │   └── Update
│       │       ├── Update.drawio
│       │       ├── Update.drawio.svg
│       │       └── Update.png
│       ├── Invitation
│       │   ├── Accept
│       │   │   ├── Accept.drawio
│       │   │   ├── Accept.drawio.svg
│       │   │   └── Accept.png
│       │   └── Create
│       │       ├── Create.drawio
│       │       ├── Create.drawio.svg
│       │       └── Create.png
│       └── User
│           ├── Create
│           │   ├── Create.drawio
│           │   ├── Create.drawio.svg
│           │   └── Create.png
│           └── Update
│               ├── Update.drawio
│               ├── Update.drawio.svg
│               └── Update.png
├── init_docker_env.sh
├── inversify.config.ts
├── Makefile
├── ormconfig.ts
├── package.json
├── README.md
├── run.sh
├── src <-- Source code
│   ├── controller
│   │   └── v1
│   │       ├── Area.controller.ts
│   │       ├── Entity.controller.ts 
│   │       ├── EntityType.Controller.ts
│   │       ├── Home.controller.ts
│   │       ├── Invitation.controller.ts
│   │       ├── Member.controller.ts
│   │       ├── System.controller.ts
│   │       ├── User.controller.ts
│   │       └── Version.controller.ts
│   ├── helper <-- Implement helper interface for interacting with other services
│   │   ├── Auth.helper.ts
│   │   ├── Email.helper.ts
│   │   ├── Entity.helper.ts
│   │   ├── EntityType.helper.ts
│   │   ├── Logger.helper.ts
│   │   ├── Notify.helper.ts
│   │   ├── Policy.helper.ts
│   │   ├── Response.helper.ts
│   │   ├── Timestamp.helper.ts
│   │   └── TOTP.helper.ts
│   ├── index.ts
│   ├── interface <-- Provide interface for controller
│   │   ├── IAuth.interface.ts
│   │   ├── ICRUD.interface.ts
│   │   ├── IEmail.interface.ts
│   │   ├── IEntity.interface.ts
│   │   ├── IEntityType.interface.ts
│   │   ├── ILogger.interface.ts
│   │   ├── INotify.interface.ts
│   │   ├── IPolicy.interface.ts
│   │   ├── IResponser.interface.ts
│   │   ├── ITimestamp.Interface.ts
│   │   ├── ITOTP.interface.ts
│   │   └── IValid.interface.ts
│   ├── migration <-- Database migration
│   │   ├── 1617700928912-home.ts
│   │   ├── 1619595238941-service_home.ts
│   │   ├── 1619598546184-serviceHome.ts
│   │   ├── 1619617832571-home_service.ts
│   │   ├── 1619665931982-home_service.ts
│   │   ├── 1619701561672-home_service.ts
│   │   ├── 1620025124332-home_service.ts
│   │   ├── 1620200842115-home_service.ts
│   │   ├── 1620360442096-home_service.ts
│   │   ├── 1620362430500-home_service.ts
│   │   ├── 1620382022046-service_home.ts
│   │   ├── 1620488297791-home_service.ts
│   │   ├── 1620964895688-service_home.ts
│   │   └── 1620976677796-home_service.ts
│   ├── model <-- Database scheme abstract class
│   │   └── v1
│   │       ├── AreaStatistical.ts
│   │       ├── Area.ts
│   │       ├── Audit.ts
│   │       ├── Entity.ts
│   │       ├── HomeStatistical.ts
│   │       ├── Home.ts
│   │       ├── Invitation.ts
│   │       ├── Member.ts
│   │       ├── User.ts
│   │       ├── Verify.ts
│   │       └── Version.ts
│   ├── response <-- Defination of response code
│   │   └── Error.response.ts
│   ├── route <-- Router
│   │   ├── v1
│   │   │   ├── Area.route.ts
│   │   │   ├── Entity.route.ts
│   │   │   ├── EntityType.route.ts
│   │   │   ├── Home.route.ts
│   │   │   ├── Invitation.route.ts
│   │   │   ├── Member.route.ts
│   │   │   ├── route.v1.ts
│   │   │   ├── System.router.ts
│   │   │   ├── User.route.ts
│   │   │   └── Version.route.ts
│   │   └── v2
│   │       ├── Area.route.ts
│   │       ├── Entity.route.ts
│   │       ├── Home.route.ts
│   │       ├── Invitation.route.ts
│   │       ├── Member.route.ts
│   │       ├── route.v2.ts
│   │       └── User.route.ts
│   └── valid <-- System validation before access any controllers
│       ├── v1
│       │   ├── Area.valid.ts
│       │   ├── EntityType.valid.ts
│       │   ├── Entity.valid.ts
│       │   ├── Home.valid.ts
│       │   ├── Invitation.valid.ts
│       │   ├── Member.valid.ts
│       │   ├── User.valid.ts
│       │   └── Version.valid.ts
│       └── v2
│           ├── Area.valid.ts
│           ├── Device.valid.ts
│           ├── Home.valid.ts
│           ├── Invitation.valid.ts
│           └── User.valid.ts
├── tree
├── tsconfig.json
└── webpack.config.js

```

# Error Code

| Error Code | Detail | Vietnamese | English |
|-|-|-|-|
| 6000 | UserId wrong type |  |  |
| 6001 | UserId required |  |  |
| 6002 | UserId wrong format |  |  |
| 6003 | UserId empty |  |  |
| 6004 | UserId out of bound |  |  |
| 6005 | User not found |  |  |
| 6006 | Home id wrong type |  |  |
| 6007 | Home id  required |  |  |
| 6008 | Home id empty |  |  |
| 6009 | Home id wrong format |  |  |
| 6010 | Home id out of bound |  |  |
| 6011 | Nothing to be changed |  |  |
| 6012 | Does not have permission |  |  |
| 6013 | App name wrong type |  |  |
| 6014 | App name required |  |  |
| 6015 | App name empty |  |  |
| 6016 | App name out of bound |  |  |
| 6017 | Email wrong type |  |  |
| 6018 | Email required |  |  |
| 6019 | Email wrong format |  |  |
| 6020 | Email empty |  |  |
| 6021 | Email out of bound |  |  |
| 6022 | Email registered |  |  |
| 6023 | Email not found |  |  |
| 6024 | Verify code wrong type |  |  |
| 6025 | Verify code required |  |  |
| 6026 | Verify code not match |  |  |
| 6027 | Verify code empty |  |  |
| 6028 | Verify code out of bound |  |  |
| 6029 | User existed |  |  |
| 6030 | Register error |  |  |
| 6031 | Password wrong type |  |  |
| 6032 | Password required |  |  |
| 6033 | Password wrong format |  |  |
| 6034 | Password empty |  |  |
| 6035 | Password out of bound |  |  |
| 6036 | Comfirmation password wrong type |  |  |
| 6037 | Confirmation password required |  |  |
| 6038 | Confirmation password wrong format |  |  |
| 6039 | Confirmation password empty |  |  |
| 6040 | Confirmation password out of bound |  |  |
| 6041 | Confirmation password not match |  |  |
| 6042 | Nick name wrong type |  |  |
| 6043 | Nick name required |  |  |
| 6044 | Nick name wrong format |  |  |
| 6045 | Nick name empty |  |  |
| 6046 | Nick name out of bound |  |  |
| 6047 | Home name out of bound |  |  |
| 6048 | Home logo out of bound |  |  |
| 6049 | Home position out of range | Tên nhà được nhập tối đa 256 kí tự |  |
| 6050 | Home existed |  |  |
| 6051 | Home name required |  |  |
| 6052 | Home not found | Tên nhà đã tồn tại |  |
| 6053 | Home name empty |  |  |
| 6054 | Home name wrong type |  |  |
| 6055 | Home logo wrong type |  |  |
| 6056 | Home position wrong type |  |  |
| 6057 | Area id type error |  |  |
| 6058 | Area id required |  |  |
| 6059 | Area id empty |  |  |
| 6060 | Area id wrong format |  |  |
| 6061 | Area id out of bound |  |  |
| 6062 | Area name out of bound |  |  |
| 6063 | Area logo out of bound |  |  |
| 6064 | Area position out of range |  |  |
| 6065 | Area not found |  |  |
| 6066 | Area is existed |  |  |
| 6067 | Area logo wrong type |  |  |
| 6068 | Area position wrong type |  |  |
| 6069 | Area name wrong type |  |  |
| 6070 | Area name required |  |  |
| 6071 | Area name empty |  |  |
| 6072 | Invitation id required |  |  |
| 6073 | Invitation id empty |  |  |
| 6074 | Invitation id wrong format |  |  |
| 6075 | Invitation id wrong type |  |  |
| 6076 | Invitation id out of bound |  |  |
| 6077 | Invitation isRead wrong format |  |  |
| 6078 | Invitation isRead wrong type |  |  |
| 6079 | Invitation isRead required |  |  |
| 6080 | Invitation state wrong format |  |  |
| 6081 | Invitation state wrong type |  |  |
| 6082 | Invitation state out of range |  |  |
| 6083 | Invitation state required |  |  |
| 6084 | Note wrong type |  |  |
| 6085 | Note out of bound |  |  |
| 6086 | User is not owner |  |  |
| 6087 | Member is existed |  |  |
| 6088 | Invitation is existed |  |  |
| 6089 | Invitation not found |  |  |
| 6090 | Member id wrong type |  |  |
| 6091 | Member id required |  |  |
| 6092 | Member id empty |  |  |
| 6093 | Member id wrong format |  |  |
| 6094 | Member id out of bound |  |  |
| 6095 | Member email wrong type |  |  |
| 6096 | Member email required |  |  |
| 6097 | Member email empty |  |  |
| 6098 | Member email wrong format |  |  |
| 6099 | Member email out of bound |  |  |
| 6100 | Member name wrong type |  |  |
| 6101 | Member name out of bound |  |  |
| 6102 | Member not found |  |  |
| 6103 | Entity id wrong type |  |  |
| 6104 | Entity id required |  |  |
| 6105 | Entity id empty |  |  |
| 6106 | Entity id out of bound |  |  |
| 6107 | Entity is existed |  |  |
| 6108 | Entity not found |  |  |
| 6109 | Entity sentitive wrong type |  |  |
| 6110 | Entity type name wrong type |  |  |
| 6111 | Entity type name required |  |  |
| 6112 | Entity type name empty |  |  |
| 6113 | Entity type name out of bound |  |  |
| 6114 | Entity sentitive is required |  |  |
| 6115 | Entity sentitive empty |  |  |
| 6116 | Entity sentittive wrong format |  |  |
| 6117 | Entity name wrong type |  |  |
| 6118 | Entity name out of bound |  |  |
| 6119 | Entity type id wrong type |  |  |
| 6120 | Entity type id required |  |  |
| 6121 | Entity type id empty |  |  |
| 6122 | Entity type id wrong format |  |  |
| 6123 | Entity type id out of bound |  |  |
| 6124 | Entity parent id wrong type |  |  |
| 6125 | Entity parent id required |  |  |
| 6126 | Entity parent id empty |  |  |
| 6127 | Entity parent id out of bound |  |  |
| 6128 | Entity pairing token wrong type |  |  |
| 6129 | Entity paring token required |  |  |
| 6130 | Entity paring token empty |  |  |
| 6131 | Entity paring token out of bound |  |  |
| 6132 | Entity could not be registered for device type |  |  |
| 6133 | Entity position wrong type |  |  |
| 6134 | Entity position out of bound |  |  |
| 6135 | Entity logo wrong type |  |  |
| 6136 | Entity logo out of bound |  |  |
| 6137 | Parent not found |  |  |
| 6138 | Entity could not be registered for this app |  |  |
| 6139 | Pairing token is not correct |  |  |
| 6140 | Entity infor not found |  |  |
| 6141 | List entity sharing required |  |  |
| 6142 | List entity sharing empty |  |  |
| 6143 | Entity is shared |  |  |
| 6144 | List entity unsharing required |  |  |
| 6145 | List entity unsharing empty |  |  |
| 6146 | Entity has not been shared with this member |  |  |
| 6147 | Phone wrong type |  |  |
| 6148 | Phone out of bound |  |  |
| 6149 | Adress wrong type |  |  |
| 6150 | Address out of bound |  |  |
| 6151 | FCM wrong type |  |  |
| 6152 | FCM out of bound |  |  |
| 6153 | avatar wrong type |  |  |
| 6154 | avatar out of bound |  |  |
| 6155 | lang wrong type |  |  |
| 6156 | lang wrong format |  |  |
| 6157 | lang out of bound |  |  |
| 6158 | FCM empty |  |  |
| 6159 | FCM required |  |  |
| 6160 | Entity name empty |  |  |
| 6161 | Appname wrong format |  |  |
| 6162 | Version empty |  |  |
| 6163 | Version required |  |  |
| 6164 | Version wrong type |  |  |
| 6165 | Version wrong format |  |  |
| 6166 | Version out of bound |  |  |
| 6167 | Version id wrong type |  |  |
| 6168 | Version id required |  |  |
| 6169 | Version id empty |  |  |
| 6170 | Version id out of bound |  |  |
| 6171 | Version id wrong format |  |  |
| 6172 | Version not found |  |  |
| 6173 | Version existed |  |  |
| 6174 | New version less than old version |  |  |
| 6175 | Param is not acceptable |  |  |
| 6176 | App name not found |  |  |