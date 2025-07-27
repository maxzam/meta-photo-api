import fastify from "fastify";
import app from "./app";

const server = fastify({
  logger: true,
});

server.register(app);

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const address = process.env.HOST || "0.0.0.0";

    await server.listen({ port, host: address });
    server.log.info(`Server listening on ${address}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
