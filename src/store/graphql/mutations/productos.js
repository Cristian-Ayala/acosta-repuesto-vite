/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client/core";

export const CREATE_UPDATE_PRODUCTO = gql`
  mutation CREATE_UPDATE_PRODUCTO(
    $producto: acostarep_productos_insert_input!
    $update_columns: [acostarep_productos_update_column!]
  ) {
    insert_acostarep_productos_one(
      object: $producto
      on_conflict: {
        constraint: productos_pkey
        update_columns: $update_columns
      }
    ) {
      id
      nombre_producto
    }
  }
`;

export const DELETE_PRODUCTO = gql`
mutation DELETE_PRODUCTO($id: Int!) {
  update_acostarep_productos_by_pk(pk_columns: {id: $id}, _set: {is_active_producto: false}) {
    id
    nombre_producto
  }
}
`;
