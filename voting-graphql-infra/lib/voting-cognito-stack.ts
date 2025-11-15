import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "aws-cdk-lib/aws-cognito-identitypool";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import path from "path";

export class CognitoStack extends Stack {
  public readonly userPoolId: CfnOutput;
  public readonly userPoolClientId: CfnOutput;
  public readonly identityPoolId: CfnOutput;
  public readonly userPoolArn: CfnOutput;
  public readonly authenticatedRoleArn: CfnOutput;
  public readonly unauthenticatedRoleArn: CfnOutput;
  public readonly snsTopicArn: CfnOutput;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const snsTopic = new Topic(this, "SNSTopicVotingWebApp", {
      displayName: "VotingWebAppTopic",
    });

    const postConfirmationLambda = new NodejsFunction(
      this,
      "PostConfirmationLambdaVotingWebApp",
      {
        functionName: "PostConfirmationLambdaVotingWebApp",
        entry: path.join(__dirname, "functions/post-confirmation.ts"),
        runtime: Runtime.NODEJS_20_X,
        environment: {
          SNS_TOPIC_ARN: snsTopic.topicArn,
        },

        bundling: {
          minify: true,
          sourceMap: true,
          externalModules: ["aws-sdk"],
        },
      }
    );

    postConfirmationLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["sns:Subscribe"],
        resources: [snsTopic.topicArn],
      })
    );

    const userPool = new UserPool(this, "UserPoolVotingGraphql", {
      userPoolName: "UserPoolVotingGraphql",
      selfSignUpEnabled: true, // Allow users to sign up themselves
      signInAliases: {
        email: true, // Allow users to sign in with their email
      },
      autoVerify: {
        email: true, // Automatically verify email addresses
      },
      lambdaTriggers: {
        postConfirmation: postConfirmationLambda,
      },
    });

    postConfirmationLambda.addPermission("PostConfirmationPermission", {
      principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
      sourceArn: userPool.userPoolArn,
    });

    const userPoolClient = new UserPoolClient(
      this,
      "UserPoolClientVotingGraphql",
      {
        userPool,
        generateSecret: false, // No secret needed for web apps running in browsers
      }
    );

    // create an identity pool if needed in the future
    const identityPool = new IdentityPool(this, "IdentityPoolVotingGraphql", {
      allowUnauthenticatedIdentities: true,
      authenticationProviders: {
        userPools: [
          new UserPoolAuthenticationProvider({
            userPool,
            userPoolClient,
          }),
        ],
      },
    });

    // exports
    this.userPoolId = new CfnOutput(this, "CFUserPoolId", {
      value: userPool.userPoolId,
    });

    this.userPoolClientId = new CfnOutput(this, "CFUserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    this.identityPoolId = new CfnOutput(this, "CFIdentityPoolId", {
      value: identityPool.identityPoolId,
    });

    this.userPoolArn = new CfnOutput(this, "CFUserPoolArn", {
      value: userPool.userPoolArn,
    });
    this.authenticatedRoleArn = new CfnOutput(this, "CFAuthenticatedRoleArn", {
      value: identityPool.authenticatedRole.roleArn,
    });
    this.unauthenticatedRoleArn = new CfnOutput(
      this,
      "CFUnauthenticatedRoleArn",
      {
        value: identityPool.unauthenticatedRole.roleArn,
      }
    );
    this.snsTopicArn = new CfnOutput(this, "CFSnsTopicArn", {
      value: snsTopic.topicArn,
    });
  }
}
