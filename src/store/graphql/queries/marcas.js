/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const GET_MARCAS = gql`
  query GET_MARCAS {
    marcas: acostarep_marcas(
      where: { is_active_marca: { _eq: true } }
      order_by: { nombre_marca: asc }
    ) {
      id
      nombre_marca
      descripcion_marca
    }
  }
`;
