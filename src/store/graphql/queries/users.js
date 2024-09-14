import { gql } from "@apollo/client/core";

// eslint-disable-next-line import/prefer-default-export
export const GET_USERS = gql`
  query GET_USERS($_contains: [users_roles_enum!]!) {
    users(
      order_by: { name: asc, active: desc }
      where: { roles: { _contained_in: $_contains } }
    ) {
      active
      created_on
      email
      id
      name
      roles
      sucursal
    }
  }
`;
