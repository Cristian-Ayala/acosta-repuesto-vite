import { gql } from "@apollo/client/core";
/* eslint-disable import/prefer-default-export */
export const GET_CLIENTES = gql`
  query GET_CLIENTES(
    $keyword: String = null
    $limit: Int = 10
    $offset: Int = 0
  ) {
    clientes: acostarep_cliente(
      order_by: { name: asc }
      where: {
        activo_cliente: { _eq: true }
        _or: [
          { dui: { _ilike: $keyword } }
          { email: { _ilike: $keyword } }
          { last_name: { _ilike: $keyword } }
          { name: { _ilike: $keyword } }
          { telefono: { _ilike: $keyword } }
          { empresa: { _ilike: $keyword } }
        ]
      }
      limit: $limit
      offset: $offset
    ) {
      direccion
      dui
      email
      empresa
      id
      last_name
      name
      telefono
    }
    acostarep_cliente_aggregate(
      where: {
        activo_cliente: { _eq: true }
        _or: {
          dui: { _ilike: $keyword }
          email: { _ilike: $keyword }
          last_name: { _ilike: $keyword }
          name: { _ilike: $keyword }
          telefono: { _ilike: $keyword }
          empresa: { _ilike: $keyword }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_CLIENT_WHERE_EMAIL_OR_DUI_IS_DUPLICATED = gql`
  query GET_CLIENT_WHERE_EMAIL_OR_DUI_IS_DUPLICATED(
    $dui: String = ""
    $email: String = ""
    $id: Int = null
  ) {
    duplicatedDui: acostarep_cliente(
      where: {
        dui: { _eq: $dui }
        activo_cliente: { _eq: true }
        id: { _neq: $id }
      }
    ) {
      id
      name
      last_name
      dui
    }
    duplicatedEmail: acostarep_cliente(
      where: {
        email: { _eq: $email }
        activo_cliente: { _eq: true }
        id: { _neq: $id }
      }
    ) {
      id
      name
      last_name
      email
    }
  }
`;
