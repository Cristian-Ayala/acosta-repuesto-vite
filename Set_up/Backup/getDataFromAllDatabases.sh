#!/bin/bash

# Product Database Backup
docker exec nginx-couchdb-1 bash -c "curl -u user:password -X GET http://127.0.0.1:5984/productos/_all_docs\?include_docs\=true" > /path/to/save/data/dbProductos.json

# Category Database Backup
docker exec nginx-couchdb-1 bash -c "curl -u user:password -X GET http://127.0.0.1:5984/categorias/_all_docs\?include_docs\=true" > /path/to/save/data/dbCategorias.json

# Brand Database Backup
docker exec nginx-couchdb-1 bash -c "curl -u user:password -X GET http://127.0.0.1:5984/marcas/_all_docs\?include_docs\=true" > /path/to/save/data/dbMarcas.json

# Orders Database Backup
docker exec nginx-couchdb-1 bash -c "curl -u user:password -X GET http://127.0.0.1:5984/ordenes/_all_docs\?include_docs\=true" > /path/to/save/data/dbOrdenes.json

# Usuarios Database Backup
docker exec nginx-couchdb-1 bash -c "curl -u user:password -X GET http://127.0.0.1:5984/users/_all_docs\?include_docs\=true" > /path/to/save/data/dbUsers.json
