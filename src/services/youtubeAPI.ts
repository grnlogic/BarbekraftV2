interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeAPIResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
}

class YouTubeAPIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY || "";
    this.baseURL =
      process.env.REACT_APP_YOUTUBE_API_URL ||
      "https://www.googleapis.com/youtube/v3/search";
  }

  async searchVideos(
    query: string,
    maxResults: number = 6
  ): Promise<YouTubeVideo[]> {
    try {
      const searchQuery = `tutorial daur ulang ${query} barang bekas DIY`;
      const url = `${
        this.baseURL
      }?part=snippet&type=video&q=${encodeURIComponent(
        searchQuery
      )}&maxResults=${maxResults}&key=${
        this.apiKey
      }&regionCode=ID&relevanceLanguage=id`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeAPIResponse = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      return [];
    }
  }

  async searchRecyclingTutorials(
    categories: string[] = []
  ): Promise<YouTubeVideo[]> {
    try {
      const queries =
        categories.length > 0
          ? categories.map((cat) => `tutorial daur ulang ${cat}`)
          : [
              "tutorial daur ulang plastik",
              "tutorial daur ulang kardus",
              "tutorial daur ulang kaca",
            ];

      const allVideos: YouTubeVideo[] = [];

      for (const query of queries) {
        const videos = await this.searchVideos(query, 2);
        allVideos.push(...videos);
      }

      // Hapus duplikat berdasarkan video ID
      const uniqueVideos = allVideos.filter(
        (video, index, self) =>
          index === self.findIndex((v) => v.id.videoId === video.id.videoId)
      );

      return uniqueVideos.slice(0, 6);
    } catch (error) {
      console.error("Error fetching recycling tutorials:", error);
      return [];
    }
  }

  getVideoURL(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  getEmbedURL(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }
}

export const youtubeAPI = new YouTubeAPIService();
export type { YouTubeVideo };
