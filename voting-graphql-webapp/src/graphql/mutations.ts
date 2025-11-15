/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../services/api/graphqlAPI";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFeature = /* GraphQL */ `mutation CreateFeature(
  $condition: ModelFeatureConditionInput
  $input: CreateFeatureInput!
) {
  createFeature(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateFeatureMutationVariables,
  APITypes.CreateFeatureMutation
>;
export const deleteFeature = /* GraphQL */ `mutation DeleteFeature(
  $condition: ModelFeatureConditionInput
  $input: DeleteFeatureInput!
) {
  deleteFeature(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteFeatureMutationVariables,
  APITypes.DeleteFeatureMutation
>;
export const sendFeature =
  /* GraphQL */ `mutation SendFeature($email: String, $id: ID!, $text: String, $voteCount: Int) {
  sendFeature(email: $email, id: $id, text: $text, voteCount: $voteCount)
}
` as GeneratedMutation<
    APITypes.SendFeatureMutationVariables,
    APITypes.SendFeatureMutation
  >;
export const updateFeature = /* GraphQL */ `mutation UpdateFeature(
  $condition: ModelFeatureConditionInput
  $input: UpdateFeatureInput!
) {
  updateFeature(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateFeatureMutationVariables,
  APITypes.UpdateFeatureMutation
>;
