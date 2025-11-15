import { Stack, StackProps, SecretValue } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { GitHubSourceCodeProvider, App } from "@aws-cdk/aws-amplify-alpha";

interface VotingAmplifyHostingStackProps extends StackProps {
  cognito: {
    userPoolId: string;
    userPoolClientId: string;
    identityPoolId: string;
    authenticatedRoleArn: string;
    unauthenticatedRoleArn: string;
  };
  serverUrl: string;
}

export class VotingAmplifyHostingStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: VotingAmplifyHostingStackProps
  ) {
    super(scope, id, props);

    const amplifyApp = new App(this, "VotingWebApp", {
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: "vgiabao",
        repository: "voting-app",
        oauthToken: SecretValue.secretsManager("github-token"),
      }),
      environmentVariables: {
        REGION: this.region,
        SERVER_URL: props.serverUrl,
        VITE_IS_SERVER_MOCK: "false",
        VITE_IS_AUTH_MOCK: "false",
        USER_POOL_ID: props.cognito.userPoolId,
        USER_POOL_CLIENT_ID: props.cognito.userPoolClientId,
        IDENTITY_POOL_ID: props.cognito.identityPoolId,
      },
    });
  }
}
