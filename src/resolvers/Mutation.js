const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

async function signup(parent, args, context) {
  // configure password
  const password = await bcrypt.hash(args.password, 10);

  // create a new user
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function post(parent, args, context) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  // publish
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function vote(parent, args, context) {
  const userId = context.userId;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted to ${args.linkId}`);
  }

  const newVote = await context.prisma.vote.create({
    data: {
      user: {
        connect: { id: userId },
      },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
