import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
import { User } from "../types/User";
import { EnrichedPhoto } from "../types/EnrichedPhoto";
import { EnrichedAlbum } from "../types/EnrichedAlbum";

export function mapToEnrichedPhoto(
  photo: Photo,
  album: EnrichedAlbum | null
): EnrichedPhoto {
  const enrichedPhoto: EnrichedPhoto = {
    id: photo.id,
    title: photo.title,
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl,
    album: album,
  };

  return enrichedPhoto;
}

export function mapToEnrichedAlbum(
  album: Album,
  user: User | null
): EnrichedAlbum {
  const enrichedAlbum: EnrichedAlbum = {
    id: album.id,
    title: album.title,
    user: user,
  };

  return enrichedAlbum;
}
