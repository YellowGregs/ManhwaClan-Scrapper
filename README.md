# ManhwaClan-Scrapper

This was a quite fun project I did for fun to create my own Manhwa/Manga/Manhua Website, and this just only scraps from the [ManhwaClan](https://manhwaclan.com/) Website, that's all.

## API Endpoints

### Get Chapter Images
- **Endpoint:** `GET` `/api/:name/:chapter/images`

**Example Request:**
```
GET https://manhwa-clan.vercel.app/api/solo-leveling/1/images
```

**Example Response:**
```json
{
  "images": [
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/001.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/002.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/003.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/004.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/005.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/006.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/007.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/008.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/009.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/010.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/011.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/012.jpg",
    "https://img-1.manhwaclan.com/solo-leveling/chapter-1/013.jpg"
  ]
}
```

### Get Image by URL
- **Endpoint:** `GET` `/api/image`

**Example Request:**
```
GET https://manhwa-clan.vercel.app/api/image?url=https://img-1.manhwaclan.com/solo-leveling/chapter-1/001.jpg
```

This endpoint fetches an image directly from the given URL, bypassing CORS issues by serving it through your server.

### Get Details
- **Endpoint:** `GET` `/api/:name/details`

**Example Request:**
```
GET https://manhwa-clan.vercel.app/api/solo-leveling/details
```

**Example Response:**
```json
{
  "mangaTitle": "Solo Leveling",
  "summary": "",
  "imageUrl": "https://manhwaclan.com/wp-content/uploads/2023/01/Solo-Leveling-cover-193x278.jpg",
  "rating": "4.7",
  "rank": "11th, it has 285K monthly views",
  "alternative": "",
  "genres": [
    "Action",
    "Adventure",
    "Manhua",
    "Manhwa",
    "Shounen"
  ],
  "type": "manhwa",
  "status": "OnGoing"
}
```

### Search
- **Endpoint:** `GET` `/api/search/:query/:page`

**Example Request:**
```
GET https://manhwa-clan.vercel.app/api/search/solo/1
```

**Example Response (Page 1):**
```json
{
  "results": [
    {
      "title": "I’m a Solo Guide",
      "url": "https://manhwaclan.com/manga/im-a-solo-guide/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/i%E2%80%99m-a-solo-guide/details"
    },
    {
      "title": "Solo Reincarnation",
      "url": "https://manhwaclan.com/manga/solo-reincarnation/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-reincarnation/details"
    },
    {
      "title": "Solo Leveling: Ragnarok",
      "url": "https://manhwaclan.com/manga/solo-leveling-ragnarok/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-leveling%3A-ragnarok/details"
    },
    {
      "title": "Solo Eating",
      "url": "https://manhwaclan.com/manga/solo-eating/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-eating/details"
    },
    {
      "title": "Solo Farming In The Tower",
      "url": "https://manhwaclan.com/manga/solo-farming-in-the-tower/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-farming-in-the-tower/details"
    },
    {
      "title": "Solo Leveling",
      "url": "https://manhwaclan.com/manga/solo-leveling/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-leveling/details"
    },
    {
      "title": "Solo Max-Level Newbie",
      "url": "https://manhwaclan.com/manga/solo-max-level-newbie/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/solo-max-level-newbie/details"
    },
    {
      "title": "The Supporting Duck Waiting for the Breakup",
      "url": "https://manhwaclan.com/manga/the-supporting-duck-waiting-for-the-breakup/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/the-supporting-duck-waiting-for-the-breakup/details"
    },
    {
      "title": "The Indomitable Martial King",
      "url": "https://manhwaclan.com/manga/the-indomitable-martial-king/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/the-indomitable-martial-king/details"
    },
    {
      "title": "The Last Adventurer",
      "url": "https://manhwaclan.com/manga/the-last-adventurer/",
      "apiUrl": "https://manhwa-clan.vercel.app/api/the-last-adventurer/details"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "nextPage": "https://manhwaclan.com/?s=solo&post_type=wp-manga&page=2",
    "UrlApi_Next": "https://manhwa-clan.vercel.app/api/search/solo/2",
    "prevPage": null,
    "UrlApi_Prev": null
  }
}
```

## Silent Update I did
- **API Improvement:** Added the `/api/image` endpoint to fetch images directly through the server, bypassing CORS issues.
- **Code Improvements:** Updated user-agent headers, and added delays between requests to mimic browser behavior and avoid being blocked.

## Note
- This is still a work in progress, so I need to improve more of it.
