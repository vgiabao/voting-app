/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api/graphqlAPI";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFeature =
  /* GraphQL */ `subscription OnCreateFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onCreateFeature(filter: $filter) {
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
` as GeneratedSubscription<
    APITypes.OnCreateFeatureSubscriptionVariables,
    APITypes.OnCreateFeatureSubscription
  >;
export const onDeleteFeature =
  /* GraphQL */ `subscription OnDeleteFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onDeleteFeature(filter: $filter) {
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
` as GeneratedSubscription<
    APITypes.OnDeleteFeatureSubscriptionVariables,
    APITypes.OnDeleteFeatureSubscription
  >;
export const onUpdateFeature =
  /* GraphQL */ `subscription OnUpdateFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onUpdateFeature(filter: $filter) {
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
` as GeneratedSubscription<
    APITypes.OnUpdateFeatureSubscriptionVariables,
    APITypes.OnUpdateFeatureSubscription
  >;
