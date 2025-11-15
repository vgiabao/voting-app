/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api/graphqlAPI";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFeature = /* GraphQL */ `query GetFeature($id: ID!) {
  getFeature(id: $id) {
    createdAt
    endTime
    id
    owner
    status
    text
    updatedAt
    voteCount
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFeatureQueryVariables,
  APITypes.GetFeatureQuery
>;
export const listFeatures = /* GraphQL */ `query ListFeatures(
  $filter: ModelFeatureFilterInput
  $limit: Int
  $nextToken: String
) {
  listFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      endTime
      id
      owner
      status
      text
      updatedAt
      voteCount
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFeaturesQueryVariables,
  APITypes.ListFeaturesQuery
>;
