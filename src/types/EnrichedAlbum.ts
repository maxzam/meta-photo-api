import { Album } from "./Album";
import { User } from "./User";

export interface EnrichedAlbum extends Omit<Album, "userId"> {
  user?: User | null;
}
