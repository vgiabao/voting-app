import {
  AmplifyGraphqlApi,
  AmplifyGraphqlDefinition,
  FieldLogLevel,
  RetentionDays,
} from "@aws-amplify/graphql-api-construct";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import path from "path";

interface AppSyncStackProps extends StackProps {
  cognito: {
    userPoolId: string;
    userPoolClientId: string;
    identityPoolId: string;
    authenticatedRoleArn: string;
    unauthenticatedRoleArn: string;
  };
  snsTopicArn: string;
}

export class AppSyncStack extends Stack {
  public readonly appSyncUrl: CfnOutput;
  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);
    const snsTopic = Topic.fromTopicArn(
      this,
      "ImportedSNSTopic",
      props.snsTopicArn
    );

    const sendFeatureFunction = new NodejsFunction(
      this,
      "SendFeatureLambdaVotingWebApp",
      {
        functionName: "SendFeatureLambdaVotingWebApp",
        entry: path.join(__dirname, "functions/send-feature.ts"),
        handler: "handler",
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

    sendFeatureFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["sns:Publish"],
        resources: [snsTopic.topicArn],
      })
    );

    const authenticatedUserRole = Role.fromRoleArn(
      this,
      "ImportedAuthenticatedRole",
      props.cognito.authenticatedRoleArn
    );
    const unauthenticatedUserRole = Role.fromRoleArn(
      this,
      "InportedUnauthenticatedRole",
      props.cognito.unauthenticatedRoleArn
    );

    const api = new AmplifyGraphqlApi(this, "AppSyncAPIVotingAPP", {
      apiName: "voting-api",
      definition: AmplifyGraphqlDefinition.fromFiles(
        path.join(__dirname, "schema/schema.graphql")
      ),
      authorizationModes: {
        defaultAuthorizationMode: "AWS_IAM",
        identityPoolConfig: {
          identityPoolId: props.cognito.identityPoolId,
          authenticatedUserRole,
          unauthenticatedUserRole,
        },
      },
      logging: {
        fieldLogLevel: FieldLogLevel.ALL,
        excludeVerboseContent: false,
        retention: RetentionDays.ONE_DAY,
      },
    });

    this.appSyncUrl = new CfnOutput(this, "GraphQLAPIVotingApp", {
      value: api.graphqlUrl,
    });
  }
}
