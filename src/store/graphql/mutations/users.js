import { gql } from "@apollo/client/core";

// eslint-disable-next-line import/prefer-default-export
export const UPDATE_USER = gql`
  mutation UPDATE_USER($id: uuid!, $usr: users_set_input!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $usr) {
      active
      email
      name
      roles
      sucursal
      id
    }
  }
`;

