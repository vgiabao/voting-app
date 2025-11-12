import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "aws-cdk-lib/aws-cognito-identitypool";
import { Construct } from "constructs";

export class CognitoStack extends Stack {
  public readonly userPoolId: CfnOutput;
  public readonly userPoolClientId: CfnOutput;
  public readonly identityPoolId: CfnOutput;
  public readonly userPoolArn: CfnOutput;
  public readonly authenticatedRoleArn: CfnOutput;
  public readonly unauthenticatedRoleArn: CfnOutput;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "UserPoolVotingGraphql", {
      userPoolName: "UserPoolVotingGraphql",
      selfSignUpEnabled: true, // Allow users to sign up themselves
      signInAliases: {
        email: true, // Allow users to sign in with their email
      },
      autoVerify: {
        email: true, // Automatically verify email addresses
      },
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
  }
}
