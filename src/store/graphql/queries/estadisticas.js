import { gql } from "@apollo/client/core";

export const GET_STATISTICS = gql`
  query GET_STATISTICS(
    $fromDate: timestamptz!
    $toDate: timestamptz!
    $createdBy: uuid!
    $cedes: [String!]
  ) {
    numeroOrdenes: acostarep_ordenes_aggregate(
      where: {
        created_at: { _gte: $fromDate, _lte: $toDate }
        created_by: { _eq: $createdBy }
        cede: { _in: $cedes }
      }
    ) {
      aggregate {
        count
      }
    }
    maxTotal: acostarep_ordenes_aggregate(
      where: {
        created_at: { _gte: $fromDate, _lte: $toDate }
        created_by: { _eq: $createdBy }
        cede: { _in: $cedes }
      }
    ) {
      aggregate {
        max {
          total_orden
        }
      }
    }
    minTotal: acostarep_ordenes_aggregate(
      where: {
        created_at: { _gte: $fromDate, _lte: $toDate }
        created_by: { _eq: $createdBy }
        cede: { _in: $cedes }
      }
    ) {
      aggregate {
        min {
          total_orden
        }
      }
    }
    totalOrdenes: acostarep_ordenes_aggregate(
      where: {
        created_at: { _gte: $fromDate, _lte: $toDate }
        created_by: { _eq: $createdBy }
        cede: { _in: $cedes }
      }
    ) {
      aggregate {
        sum {
          total_orden
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS($cedes: [String!]!) {
    users: acostarep_ordenes(
      distinct_on: created_by
      where: { cede: { _in: $cedes } }
    ) {
      id
      created_by
      cede
    }
  }
`;
