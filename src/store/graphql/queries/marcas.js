/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const GET_MARCAS = gql`
  query GET_MARCAS($limit: Int = 10, $offset: Int = 0) {
    marcas: acostarep_marcas(
      limit: $limit
      offset: $offset
      where: { is_active_marca: { _eq: true } }
      order_by: { nombre_marca: asc }
    ) {
      descripcion_marca
      id
      nombre_marca
    }
    totalRows: acostarep_marcas_aggregate {
      aggregate {
        count
      }
    }
  }
`;
