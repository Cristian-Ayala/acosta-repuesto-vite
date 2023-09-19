/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const GET_CATEGORIAS = gql`
  query GET_CATEGORIAS {
    categorias: acostarep_categorias(
      where: { is_active_categoria: { _eq: true } }
      order_by: { nombre_categoria: asc }
      offset: 0
      limit: 10
    ) {
      id
      nombre_categoria
      descripcion_categoria
    }
    totalRows: acostarep_categorias_aggregate(
      where: { is_active_categoria: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
