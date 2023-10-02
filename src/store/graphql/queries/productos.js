/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const GET_PRODUCTOS = gql`
query GET_PRODUCTOS($limit: Int = 10, $offset: Int = 0, $where: acostarep_productos_bool_exp!) {
  productos: acostarep_productos(where: $where, limit: $limit, offset: $offset, order_by: {nombre_producto: asc}) {
    nombre_producto
    stock_prod_metapan
    stock_prod_sta_ana
    upc
    foto
    precio_mayoreo
    precio_publico
    precio_taller
    categoria {
      nombre_categoria
    }
    marca {
      nombre_marca
    }
  }
  totalRows: acostarep_productos_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
`;
