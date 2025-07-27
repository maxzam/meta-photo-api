import { Photo } from "./Photo";
import { EnrichedAlbum } from "./EnrichedAlbum";

export interface EnrichedPhoto extends Omit<Photo, "albumId"> {
  album?: EnrichedAlbum | null;
}
