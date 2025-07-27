import { FastifyInstance } from "fastify";
import { HttpStatusCode } from "axios";
import { User } from "../types/User";
import NodeCache from "node-cache";

export class UserService {
  private readonly fastify: FastifyInstance;
  private readonly userCache: NodeCache;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.userCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.fastify.externalService.get("/users");
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve users.", { cause: error });
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const cacheKey = `user-${id}`;
    const cachedUser = this.userCache.get<User | null>(cacheKey);
    if (cachedUser !== undefined) {
      return cachedUser;
    }
    try {
      const response = await this.fastify.externalService.get(`/users/${id}`);
      const userData: User = response.data;
      this.userCache.set(cacheKey, userData);
      return userData;
    } catch (error: any) {
      if (error.response && error.response.status === HttpStatusCode.NotFound) {
        return null;
      }
      throw new Error(`Failed to retrieve user with ID ${id}.`);
    }
  }
}
