import { gql } from "@apollo/client/core";

export const CREATE_UPDATE_CLIENTES = gql`
  mutation MyMutation(
    $client: acostarep_cliente_insert_input!
    $update_columns: [acostarep_cliente_update_column!] = [
      name
      last_name
      direccion
      dui
      email
      empresa
      telefono
    ]
  ) {
    insertClient: insert_acostarep_cliente_one(
      object: $client
      on_conflict: { constraint: cliente_pkey, update_columns: $update_columns }
    ) {
      id
      name
      last_name
    }
  }
`;

export const DELETE_CLIENTE = gql`
  mutation DELETE_CLIENTE($id: Int!) {
    deleteCliente: update_acostarep_cliente_by_pk(
      pk_columns: { id: $id }
      _set: { activo_cliente: false }
    ) {
      id
    }
  }
`;
