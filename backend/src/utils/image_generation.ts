import config from "../config";
import ApiError from "../errors/api_error";
import httpStatus from "http-status";

export async function fetchImageURL(
  prompt: string
): Promise<{ imageUrl: string }> {
  const accessKey = config.unsplash_key_api;
  const url = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
    prompt
  )}&client_id=${accessKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `HTTP error! Status: ${response.status}`
      );
    const data = await response.json();
    return {
      imageUrl:
        data.results.length > 0
          ? data.results[0].urls.regular
          : "https://via.placeholder.com/400",
    };
  } catch (error) {
    return { imageUrl: "https://via.placeholder.com/400" };
  }
}
