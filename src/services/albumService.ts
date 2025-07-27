import { FastifyInstance } from "fastify";
import { HttpStatusCode } from "axios";
import { Album } from "../types/Album";
import { User } from "../types/User";
import { EnrichedAlbum } from "../types/EnrichedAlbum";
import { UserService } from "./userService";
import NodeCache from "node-cache";
import { mapToEnrichedAlbum } from "../utils/mappers";

export class AlbumService {
  private readonly fastify: FastifyInstance;
  private readonly userService: UserService;
  private readonly albumCache: NodeCache;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.userService = new UserService(fastify);
    this.albumCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
  }

  async getAllAlbums(): Promise<EnrichedAlbum[]> {
    try {
      const enrichedAlbums: EnrichedAlbum[] = [];
      const response = await this.fastify.externalService.get("/albums");
      const allAlbums: Album[] | [] = response.data;

      for (const album of allAlbums) {
        const enrichedAlbum = await this.enrichAlbum(album);

        if (enrichedAlbum) {
          enrichedAlbums.push(enrichedAlbum);
        }
      }

      return enrichedAlbums;
    } catch (error) {
      throw new Error("Failed to retrieve albums.", { cause: error });
    }
  }

  async getAlbumById(id: number): Promise<Album | null> {
    const cacheKey = `album-${id}`;
    const cachedAlbum = this.albumCache.get<Album | null>(cacheKey);
    if (cachedAlbum !== undefined) {
      return cachedAlbum;
    }

    try {
      const response = await this.fastify.externalService.get(`/albums/${id}`);

      const albumData: Album = response.data;
      this.albumCache.set(cacheKey, albumData);
      return albumData;
    } catch (error: any) {
      if (error.response && error.response.status === HttpStatusCode.NotFound) {
        return null;
      }
      throw new Error(`Failed to retrieve album with ID ${id}.`);
    }
  }

  async enrichAlbum(album: Album): Promise<EnrichedAlbum | null> {
    if (!album || Object.keys(album).length === 0) {
      return null;
    }

    let user: User | null = null;
    user = await this.userService.getUserById(album.userId);

    const enrichedAlbum: EnrichedAlbum | null = album
      ? mapToEnrichedAlbum(album, user)
      : null;

    return enrichedAlbum;
  }
}
