import { gql } from "@apollo/client/core";

export const GET_MARCAS = gql`
  query GET_MARCAS($nombreMarca: String = "%%") {
    marcas: acostarep_marcas(
      where: {
        is_active_marca: { _eq: true }
        nombre_marca: { _ilike: $nombreMarca }
      }
      order_by: { nombre_marca: asc }
    ) {
      id
      nombre_marca
      descripcion_marca
    }
  }
`;

export const GET_MARCAS_BY_ID = gql`
  query GET_MARCAS($id: Int = -1) {
    marcas: acostarep_marcas(
      where: { is_active_marca: { _eq: true }, id: { _eq: $id } }
      order_by: { nombre_marca: asc }
    ) {
      id
      nombre_marca
      descripcion_marca
    }
  }
`;
