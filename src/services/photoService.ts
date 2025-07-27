import { FastifyInstance } from "fastify";
import { HttpStatusCode } from "axios";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
import { User } from "../types/User";
import { EnrichedPhoto } from "../types/EnrichedPhoto";
import { AlbumService } from "../services/albumService";
import { UserService } from "./userService";
import { mapToEnrichedPhoto, mapToEnrichedAlbum } from "../utils/mappers";
import { EnrichedAlbum } from "../types/EnrichedAlbum";
import { PaginationParams } from "../types/controllers/PaginationParams";
import { paginate } from "../utils/paginate";

export class PhotoService {
  private readonly fastify: FastifyInstance;
  private readonly albumService: AlbumService;
  private readonly userService: UserService;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.albumService = new AlbumService(fastify);
    this.userService = new UserService(fastify);
  }

  async getAllEnrichedPhotos(
    filters: PhotoFilters,
    pagination: PaginationParams
  ): Promise<EnrichedPhoto[]> {
    try {
      const photosResponse = await this.fastify.externalService.get("/photos");
      const rawPhotos: Photo[] = photosResponse.data;
      let filteredPhotos = rawPhotos;
      let allAlbums: EnrichedAlbum[] = [];

      if (filters.title) {
        const lowerCaseFilter = filters.title.toLowerCase();
        filteredPhotos = filteredPhotos.filter((photo) =>
          photo.title.toLowerCase().includes(lowerCaseFilter)
        );
      }

      allAlbums = await this.albumService.getAllAlbums();

      const needsAlbumOrUserFiltering =
        filters["album.title"] || filters["album.user.email"];

      if (needsAlbumOrUserFiltering) {
        filteredPhotos = filteredPhotos.filter((photo) => {
          const album = allAlbums.find((a) => a.id === photo.albumId);

          if (!album) {
            return false;
          }

          let matchesAlbumTitle = true;
          if (filters["album.title"]) {
            matchesAlbumTitle = album.title
              .toLowerCase()
              .includes(filters["album.title"].toLowerCase());
          }

          let matchesUserEmail = true;
          if (filters["album.user.email"]) {
            matchesUserEmail = !!(
              album.user?.email.toLowerCase() &&
              album.user?.email.toLowerCase().toLowerCase() ===
                filters["album.user.email"].toLowerCase()
            );
          }

          return matchesAlbumTitle && matchesUserEmail;
        });
      }

      const albumMap = new Map<number, EnrichedAlbum>(
        allAlbums.map((album) => [album.id, album])
      );

      const enrichedPhotosResult = filteredPhotos.map((photo) => {
        const album = albumMap.get(photo.albumId) || null;
        return mapToEnrichedPhoto(photo, album);
      });

      return paginate(enrichedPhotosResult, pagination);
    } catch (error) {
      throw new Error("Failed to retrieve photos.", { cause: error });
    }
  }

  async getPhotoById(id: number): Promise<EnrichedPhoto | null> {
    try {
      const response = await this.fastify.externalService.get(`/photos/${id}`);
      const photo: Photo = response.data;

      if (!photo || Object.keys(photo).length === 0) {
        return null;
      }
      return this.enrichPhoto(photo);
    } catch (error: any) {
      if (error.response && error.response.status === HttpStatusCode.NotFound) {
        return null;
      }
      throw new Error(`Failed to retrieve photo with ID ${id}.`);
    }
  }

  async enrichPhoto(photo: Photo): Promise<EnrichedPhoto | null> {
    if (!photo || Object.keys(photo).length === 0) {
      return null;
    }

    const album: Album | null = await this.albumService.getAlbumById(
      photo.albumId
    );
    let user: User | null = null;
    if (album) {
      user = await this.userService.getUserById(album.userId);
    }

    const enrichedAlbum: EnrichedAlbum | null = album
      ? mapToEnrichedAlbum(album, user)
      : null;

    return mapToEnrichedPhoto(photo, enrichedAlbum);
  }
}
