import { gql } from "@apollo/client/core";

export const GET_ORDENES = gql`
  query GET_ORDENES(
    $cedes: [String!]!
    $dateFrom: timestamptz = ""
    $dateTo: timestamptz = ""
    $createdBy: String = ""
    $totalGte: float8 = ""
    $totalLte: float8 = ""
    $orderTypeID: Int = -1
    $distributionTypeID: Int = -1
    $statusID: Int = -1
    $limit: Int = 10
    $offset: Int = 0
  ) {
    ordenes: acostarep_ordenes(
      where: {
        cede: { _in: $cedes }
        is_active_orden: { _eq: true }
        created_at: { _gte: $dateFrom, _lte: $dateTo }
        created_by: { _eq: $createdBy }
        total_orden: { _gte: $totalGte, _lte: $totalLte }
        tipo_orden_id: { _eq: $orderTypeID }
        tipo_distribucion_id: { _eq: $distributionTypeID }
        status_id: { _eq: $statusID }
      }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      cede
      created_at
      id
      total_orden
      tipo_orden_id
      tipo_distribucion_id
      status_id
      observaciones_orden
      metodo_pago_id
      cliente {
        name
        last_name
        id
      }
    }
    totalOrdenes: acostarep_ordenes_aggregate(
      where: {
        cede: { _in: $cedes }
        is_active_orden: { _eq: true }
        created_at: { _gte: $dateFrom, _lte: $dateTo }
        created_by: { _eq: $createdBy }
        total_orden: { _gte: $totalGte, _lte: $totalLte }
        tipo_orden_id: { _eq: $orderTypeID }
        tipo_distribucion_id: { _eq: $distributionTypeID }
        status_id: { _eq: $statusID }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_DETALLE_ORDEN = gql`
query GET_DETALLE_ORDEN($id_orden: Int = -1) {
  detOrden: acostarep_productos_orden(where: {id_orden: {_eq: $id_orden}}) {
    id
    precio
    producto {
      nombre_producto
      upc
    }
    sub_total
    cantidad
  }
}
`;

export const GET_TYPES = gql`
query GET_TYPES {
  metPago: acostarep_types(where: {combo_objeto: {_eq: "payment_method"}}, order_by: {id: asc}) {
    id
    name
    is_active
    code
  }
  distType: acostarep_types(where: {combo_objeto: {_eq: "tipo_distribucion"}}, order_by: {id: asc}) {
    id
    name
    is_active
    code
  }
  ordType: acostarep_types(where: {combo_objeto: {_eq: "order_type"}}, order_by: {id: asc}) {
    id
    name
    is_active
    code
  }
  ordStatus: acostarep_types(where: {combo_objeto: {_eq: "order_status"}}, order_by: {id: asc}) {
    id
    name
    is_active
    code
  }
}
`;
