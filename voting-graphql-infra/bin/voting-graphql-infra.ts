#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { CognitoStack } from "../lib/voting-cognito-stack";
import { VotingAmplifyHostingStack } from "../lib/voting-amplify-hosting-stack";

const app = new cdk.App();
const cognitoStack = new CognitoStack(app, "voting-cognito-stack", {});
const amplifyHostingStack = new VotingAmplifyHostingStack(
  app,
  "voting-amplify-hosting-stack",
  {
    cognito: {
      userPoolId: cognitoStack.userPoolId.value,
      userPoolClientId: cognitoStack.userPoolClientId.value,
      identityPoolId: cognitoStack.identityPoolId.value,
      authenticatedRoleArn: cognitoStack.authenticatedRoleArn.value,
      unauthenticatedRoleArn: cognitoStack.unauthenticatedRoleArn.value,
    },
    serverUrl: "",
  }
);
