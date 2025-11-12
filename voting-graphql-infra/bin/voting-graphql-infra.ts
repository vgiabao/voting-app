#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { CognitoStack } from "../lib/voting-cognito-stack";
const app = new cdk.App();
const cognitoStack = new CognitoStack(app, "voting-cognito-stack", {});
