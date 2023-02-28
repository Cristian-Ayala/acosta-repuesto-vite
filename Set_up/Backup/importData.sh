#!/bin/bash

docker cp /path/where/transformed/data/is/transformedData nginx-couchdb-1:/tmp

# Databases need to be already created

docker exec nginx-couchdb-1 bash -c "curl -u user:password -d /tmp/transformedData/dbUsersParsed.json -H \"Content-type: application/json\" -X POST http://127.0.0.1:5984/users/_bulk_docs"
docker exec nginx-couchdb-1 bash -c "curl -u user:password -d /tmp/transformedData/dbOrdenesParsed.json -H \"Content-type: application/json\" -X POST http://127.0.0.1:5984/ordenes/_bulk_docs"
docker exec nginx-couchdb-1 bash -c "curl -u user:password -d /tmp/transformedData/dbProductosParsed.json -H \"Content-type: application/json\" -X POST http://127.0.0.1:5984/productos/_bulk_docs"
docker exec nginx-couchdb-1 bash -c "curl -u user:password -d /tmp/transformedData/dbMarcasParsed.json -H \"Content-type: application/json\" -X POST http://127.0.0.1:5984/marcas/_bulk_docs"
docker exec nginx-couchdb-1 bash -c "curl -u user:password -d /tmp/transformedData/dbCategoriasParsed.json -H \"Content-type: application/json\" -X POST http://127.0.0.1:5984/categorias/_bulk_docs"
