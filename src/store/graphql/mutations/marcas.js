import { gql } from "@apollo/client/core";

export const CREATE_UPDATE_MARCA = gql`
  mutation CREATE_UPDATE_MARCA(
    $marca: [acostarep_marcas_insert_input!] = {}
    $update_columns: [acostarep_marcas_update_column!] = [
      nombre_marca
      descripcion_marca
    ]
  ) {
    create_marca: insert_acostarep_marcas(
      objects: $marca
      on_conflict: { constraint: marcas_pkey, update_columns: $update_columns }
    ) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_MARCA = gql`
  mutation DELETE_MARCA($id: Int = -1) {
    update_marca: update_acostarep_marcas_by_pk(
      pk_columns: { id: $id }
      _set: { is_active_marca: false }
    ) {
      id
    }
  }
`;
