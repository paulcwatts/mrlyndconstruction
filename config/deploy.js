/* eslint-env node */
"use strict";

module.exports = function(deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it
      // to `false`. To disable ember-cli-deploy-cloudfront for only a particular
      // environment, add `ENV.pipeline.activateOnDeploy = false` to an environment
      // conditional below.
      activateOnDeploy: true
    },
    cloudformation: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      templateBody: "file://cfn.yml",
      capabilities: ["CAPABILITY_IAM"],
      parameters: {
        WebsiteHostname: process.env.CFN_HOSTNAME,
        DomainName: process.env.CFN_DOMAINNAME,
        CFCertificate: process.env.CFN_CERTIFICATE
      }
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket(context) {
        return context.cloudformation.outputs.AssetsBucket;
      },
      region: "us-east-1"
    },
    "s3-index": {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket(context) {
        return context.cloudformation.outputs.AssetsBucket;
      },
      region: "us-east-1",
      filePattern: "index.html",
      allowOverwrite: true
    },
    cloudfront: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      distribution(context) {
        return context.cloudformation.outputs.CloudFrontDistribution;
      }
    }
  };

  if (deployTarget === "development") {
    ENV.build.environment = "development";
    // configure other plugins for development deploy target here
  }

  if (deployTarget === "staging") {
    ENV.build.environment = "production";
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === "production") {
    ENV.build.environment = "production";
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
