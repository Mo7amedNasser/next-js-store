import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

/**
 * File is created to make a unique object session (prisma) across the project.
 * Stop the fast-refresh in the test mode because this caching many prisma objects.
 * In the production mode, We have not any fast-refreshing :-
 *    - import { PrismaClient } from "@prisma/client";
 *    - const prisma = new PrismaClient;
 *    - export default prisma;
*/
