import { gql } from "@apollo/client/core";

export const CREATE_UPDATE_CATEGORIA = gql`
  mutation CREATE_UPDATE_CATEGORIA(
    $update_columns: [acostarep_categorias_update_column!] = [
      nombre_categoria
      descripcion_categoria
    ]
    $categoria: [acostarep_categorias_insert_input!]!
  ) {
    insert_acostarep_categorias(
      objects: $categoria
      on_conflict: {
        constraint: categorias_pkey
        update_columns: $update_columns
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_CATEGORIA = gql`
  mutation DELETE_CATEGORIA($id: Int = -1) {
    deleteCategoria: update_acostarep_categorias_by_pk(
      pk_columns: { id: $id }
      _set: { is_active_categoria: false }
    ) {
      id
    }
  }
`;
