function feed(parent, args, context) {
  return context.prisma.link.findMany();
}

function link(parent, args, context) {
  return context.prisma.link.findUnique({ where: { id: Number(args.id) } });
}

function vote(parent, args, context) {
  return context.prisma.vote.findUnique({ where: { id: Number(args.id) } });
}

module.exports = {
  feed,
  link,
  vote,
};
