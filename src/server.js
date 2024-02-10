const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

// resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Vote = require("./resolvers/Vote");

// Subscription
const { PubSub } = require("apollo-server");

const prisma = new PrismaClient();
const pubsub = new PubSub();

// Resolver Function
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`launching servert at ${url}`));
