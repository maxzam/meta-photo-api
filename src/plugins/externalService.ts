import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import axios, { AxiosInstance } from "axios";

declare module "fastify" {
  interface FastifyInstance {
    externalService: AxiosInstance;
  }
}

const externalServicePlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
  const externalService: AxiosInstance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  fastify.decorate("externalService", externalService);
});

export default externalServicePlugin;
