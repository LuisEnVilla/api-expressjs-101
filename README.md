# Initial API

## Estructura de Archivos

```text
.
├── README.md
├── config
│   ├── db.js
│   ├── index.js
│   └── server.js
├── index.js
├── package.json
└── src
    └── api
    │  ├── index.js
    │  └── user
    │   ├── index.js
    │   └── model.js
    └── schemas
```

## Actualizar Dependencia

```
npm-check-updates -u
```

## Ejecutar en modo DEBUG

```
npm run debug
DEBUG=express:* nodemon index.js
```

## Variables

|Nombre |Default |Descripción|
|-------|--------|-----------|
|PORT   |3000    |Puerto de exposición de la aplicacion de node|
|DB_LOGIN|False  |Si la BD requiere credenciales|
|DB_ADDRESS|127.0.0.1|Dirección de la BD|
|DB_PORT|27017   |Puerto de la BD|
|DB_NAME|        |Nombre de la BD|
|PWS_USER|api    |Nombre del usuarios de BD|
|PWS_PASS|pwsIsGood|Contraseña del usuarios de la BD|
|DB_DEBUG|False  |Activa modo debug de Mongoose|

