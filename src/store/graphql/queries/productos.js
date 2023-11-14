import { gql } from "@apollo/client/core";

export const GET_PRODUCTOS = gql`
  query GET_PRODUCTOS(
    $limit: Int = 10
    $offset: Int = 0
    $where: acostarep_productos_bool_exp!
  ) {
    productos: acostarep_productos(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { nombre_producto: asc }
    ) {
      id
      nombre_producto
      stock_prod_metapan
      stock_prod_sta_ana
      upc
      foto
      precio_mayoreo
      precio_publico
      precio_taller
      categoria {
        id
        nombre_categoria
      }
      marca {
        id
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

export const GET_PRODUCT_BY_UPC = gql`
  query GET_PRODUCT_BY_UPC($upc: String = "DID_NOT_SELECT", $id: Int = -1) {
    listUPC: acostarep_productos(
      where: {
        upc: { _eq: $upc }
        is_active_producto: { _eq: true }
        id: { _neq: $id }
      }
    ) {
      id
      nombre_producto
      upc
    }
  }
`;
