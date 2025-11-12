import { Stack, StackProps, SecretValue } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { GitHubSourceCodeProvider, App } from "@aws-cdk/aws-amplify-alpha";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";

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
        VITE_USER_POOL_ID: props.cognito.userPoolId,
        VITE_USER_POOL_CLIENT_ID: props.cognito.userPoolClientId,
        VITE_IDENTITY_POOL_ID: props.cognito.identityPoolId,
      },

      buildSpec: BuildSpec.fromObject({
        version: "1.0",
        appRoot: "voting-graphql-web-app",
        frontend: {
          phases: {
            preBuild: {
              commands: ["npm ci"],
            },
            build: {
              commands: ["npm run build"],
            },
          },
          artifacts: {
            baseDirectory: "build",
            files: ["**/*"],
          },
          cache: {
            paths: ["node_modules/**/*"],
          },
        },
      }),
    });
  }
}
