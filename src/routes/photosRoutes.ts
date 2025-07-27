import { FastifyPluginAsync } from "fastify";
import { PhotoService } from "../services/photoService";
import { EnrichedPhoto } from "../types/EnrichedPhoto";
import { PhotoRouteParams } from "../types/controllers/PhotoRouteParams";
import { PhotoQueryParams } from "../types/controllers/PhotoQueryParams";

const photosRoutes: FastifyPluginAsync = async (fastify, opts) => {
  const photoService = new PhotoService(fastify);

  fastify.get<{ Querystring: PhotoQueryParams; Reply: EnrichedPhoto[] }>(
    "/photos",
    async (request, reply) => {
      try {
        const {
          title,
          "album.title": albumTitle,
          "album.user.email": userEmail,
          limit: limitStr,
          offset: offsetStr,
        } = request.query;

        const limit = parseInt(limitStr ?? "", 10) || 25;
        const offset = parseInt(offsetStr ?? "", 10) || 0;

        const photos = await photoService.getAllEnrichedPhotos(
          { title, "album.title": albumTitle, "album.user.email": userEmail },
          { limit, offset }
        );
        return reply.send(photos);
      } catch (error) {
        return reply.internalServerError("Failed to fetch photos.");
      }
    }
  );

  fastify.get<{
    Params: PhotoRouteParams;
    Reply: EnrichedPhoto | { message: string };
  }>("/photos/:id", async (request, reply) => {
    const photoId = parseInt(request.params.id, 10);
    if (isNaN(photoId)) {
      return reply.badRequest("ID must be a number.");
    }

    if (photoId < 1) {
      return reply.badRequest("ID must be greater than or equal to 1.");
    }

    try {
      const photo = await photoService.getPhotoById(photoId);
      if (!photo) {
        return reply.notFound("Photo not found.");
      }
      return reply.send(photo);
    } catch (error) {
      return reply.internalServerError(
        `Failed to fetch photo with ID ${photoId}.`
      );
    }
  });
};

export default photosRoutes;
