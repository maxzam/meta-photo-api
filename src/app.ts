import { FastifyPluginAsync } from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import externalServicePlugin from "./plugins/externalService";
import photosRoutes from "./routes/photosRoutes";

const app: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(sensible);
  fastify.register(cors, {
    origin: "*", // dominio
    methods: ["GET"],
  });
  fastify.register(externalServicePlugin);
  fastify.register(photosRoutes, { prefix: "/externalapi" });
};

export default app;
