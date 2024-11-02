import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

class ERROR_FOUND extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const Handler = (err: ERROR_FOUND, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      statusCode: err.statusCode || 500,
    },
  });
};

const userAgents = [ // umm yea don't ask
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
];

const Custom_headers = () => ({ // yay more headers... why me
  'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://manhwaclan.com/',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
});

//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchImages(title: string, chapter: string): Promise<string[]> {
  const url = `https://manhwaclan.com/manga/${encodeURIComponent(title)}/chapter-${chapter}/`;
  try {
    const { data } = await axios.get(url, { headers: Custom_headers() });
    const $ = cheerio.load(data);

    const imageUrls: string[] = [];
    $('.page-break img').each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl) {
        imageUrls.push(imageUrl.trim());
      }
    });

    if (imageUrls.length === 0) {
      throw new ERROR_FOUND('No images found for the chapter.', 404);
    }

    return imageUrls;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ERROR_FOUND(`Failed to fetch images: ${error.response?.statusText || error.message}`, error.response?.status || 500);
    } else {
      throw new ERROR_FOUND('An unexpected error occurred while fetching the images.', 500);
    }
  }
}

async function fetchImageUrl(imageUrl: string): Promise<Buffer> {
  try {
    //await delay(2000);
    const response = await axios.get(imageUrl, {
      headers: Custom_headers(),
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ERROR_FOUND(`Failed to fetch image: ${error.response?.statusText || error.message}`, error.response?.status || 500);
    } else {
      throw new ERROR_FOUND('An unexpected error occurred while fetching the image.', 500);
    }
  }
}

async function fetchDetails(title: string) {
  const url = `https://manhwaclan.com/manga/${encodeURIComponent(title)}/`;
  try {
    const { data } = await axios.get(url, { headers: Custom_headers() });
    const $ = cheerio.load(data);

    const mangaTitle = $('.post-title h1').text().trim();
    const summary = $('.summary_content .post-content p').text().trim();
    const imageUrl = $('.summary_image img').attr('src');

    const rating = $('.post-total-rating .score').text().trim();
    const rank = $('.post-content_item:contains("Rank") .summary-content').text().trim();
    const alternative = $('.post-content_item:contains("Alternative") .summary-content').text().trim();
    const genres = $('.genres-content a').map((i, el) => $(el).text().trim()).get();
    const type = $('.post-content_item:contains("Type") .summary-content').text().trim();
    const status = $('.post-content_item:contains("Status") .summary-content').text().trim();
    const chapters = $('.wp-manga-chapter').length;

    if (!mangaTitle) {
      throw new ERROR_FOUND('Manga/Manhwa details not found.', 404);
    }

    return {
      mangaTitle,
      summary,
      imageUrl,
      rating,
      rank,
      alternative,
      genres,
      type,
      status,
      chapters,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ERROR_FOUND(`Failed to fetch manga details: ${error.response?.statusText || error.message}`, error.response?.status || 500);
    } else {
      throw new ERROR_FOUND('An unexpected error occurred while fetching manga/manhwa details.', 500);
    }
  }
}

async function search(query: string, page: number) {
  const url = `https://manhwaclan.com/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${page}`;
  try {
    const { data } = await axios.get(url, { headers: Custom_headers() });
    const $ = cheerio.load(data);

    const results: { title: string, url: string, apiUrl: string }[] = [];
    $('.c-tabs-item__content').each((index, element) => {
      const title = $(element).find('.post-title').text().trim();
      const resultUrl = $(element).find('a').attr('href');
      if (title && resultUrl) {
        results.push({
          title,
          url: resultUrl,
          apiUrl: `https://manhwa-clan.vercel.app/api/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}/details`,
        });
      }
    });

    const currentPage = page;
    const totalPages = parseInt($('.wp-pagenavi .pages').text().match(/of (\d+)/)?.[1] ?? '0', 10);
    
    let nextPage: string | null = null;
    let prevPage: string | null = null;

    if (currentPage < totalPages) {
      nextPage = `https://manhwaclan.com/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${currentPage + 1}`;
    }

    if (currentPage > 1) {
      prevPage = `https://manhwaclan.com/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${currentPage - 1}`;
    }

    if (results.length === 0) {
      throw new ERROR_FOUND('No results found for the search query.', 404);
    }

    return {
      results,
      pagination: {
        currentPage,
        totalPages,
        nextPage,
        UrlApi_Next: nextPage ? `https://manhwa-clan.vercel.app/api/search/${encodeURIComponent(query)}/${currentPage + 1}` : null,
        prevPage,
        UrlApi_Prev: prevPage ? `https://manhwa-clan.vercel.app/api/search/${encodeURIComponent(query)}/${currentPage - 1}` : null,
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ERROR_FOUND(`Failed to search manga: ${error.response?.statusText || error.message}`, error.response?.status || 500);
    } else {
      throw new ERROR_FOUND('An unexpected error occurred while searching manga/manhwa.', 500);
    }
  }
}

app.get('/api/:name/:chapter/images', async (req: Request, res: Response, next: NextFunction) => {
  const { name, chapter } = req.params;

  try {
    const images = await fetchImages(decodeURIComponent(name), chapter);
    res.json({ images });
  } catch (error) {
    next(error);
  }
});
// cool new endpoint...
app.get('/api/image', async (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const imageData = await fetchImageUrl(url as string);
    res.set('Content-Type', 'image/jpeg');
    res.send(imageData);
  } catch (error) {
    next(error);
  }
});

app.get('/api/:name/details', async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;

  try {
    const details = await fetchDetails(decodeURIComponent(name));
    res.json(details);
  } catch (error) {
    next(error);
  }
});

app.get('/api/search/:query/:page', async (req: Request, res: Response, next: NextFunction) => {
  const { query, page } = req.params;

  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Invalid page number' });
  }

  try {
    const results = await search(decodeURIComponent(query), pageNum);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

app.use(Handler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
