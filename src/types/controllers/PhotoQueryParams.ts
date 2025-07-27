export interface PhotoQueryParams {
  title?: string;
  "album.title"?: string;
  "album.user.email"?: string;
  limit?: string;
  offset?: string;
}
