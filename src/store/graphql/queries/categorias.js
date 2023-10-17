/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const GET_CATEGORIAS = gql`
  query GET_CATEGORIAS(
    $nombreCat: String = "%%"
    $limit: Int = 10
    $offset: Int = 0
  ) {
    categorias: acostarep_categorias(
      where: {
        is_active_categoria: { _eq: true }
        nombre_categoria: { _ilike: $nombreCat }
      }
      order_by: { nombre_categoria: asc }
      offset: $offset
      limit: $limit
    ) {
      id
      nombre_categoria
      descripcion_categoria
    }
    totalRows: acostarep_categorias_aggregate(
      where: {
        is_active_categoria: { _eq: true }
        nombre_categoria: { _ilike: $nombreCat }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_CATEGORIAS_BY_KEYWORD = gql`
  query GET_CATEGORIAS_BY_KEYWORD($nombreCat: String = "%%", $limit: Int = 10) {
    categorias: acostarep_categorias(
      where: {
        is_active_categoria: { _eq: true }
        nombre_categoria: { _ilike: $nombreCat }
      }
      order_by: { nombre_categoria: asc }
      limit: $limit
    ) {
      id
      nombre_categoria
      descripcion_categoria
    }
  }
`;

export const GET_CATEGORIAS_BY_ID = gql`
  query GET_CATEGORIAS_BY_ID($id: Int = -1, $limit: Int = 10) {
    categorias: acostarep_categorias(
      where: { is_active_categoria: { _eq: true }, id: { _eq: $id } }
      order_by: { nombre_categoria: asc }
      limit: $limit
    ) {
      id
      nombre_categoria
      descripcion_categoria
    }
  }
`;
