import { gql } from "@apollo/client/core";

export const CREATE_ORDER = gql`
  mutation CREATE_ORDER($order: acostarep_ordenes_insert_input!) {
    insertOrder: insert_acostarep_ordenes_one(object: $order) {
      id
    }
  }
`;

export const CREATE_PRODUCT_BY_ORDER = gql`
  mutation CREATE_PRODUCT_BY_ORDER(
    $prodByOrder: [acostarep_productos_orden_insert_input!]!
  ) {
    insert_acostarep_productos_orden(objects: $prodByOrder) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DELETE_ORDER($id: Int!) {
    deleteOrder: update_acostarep_ordenes_by_pk(
      pk_columns: { id: $id }
      _set: { is_active_orden: false }
    ) {
      id
    }
  }
`;

export const UPDATE_STATUS_ORDER = gql`
  mutation DELETE_ORDER($id_orden: Int!, $statusId: Int!) {
    updateStatusOrder: update_acostarep_ordenes_by_pk(
      pk_columns: { id: $id_orden }
      _set: { status_id: $statusId }
    ) {
      id
    }
  }
`;
