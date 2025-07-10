// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Setup API mocks
  await page.route('/api/movies', route => {
    // Mock response for all movies
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: '1',
          name: 'Test Movie 1',
          slug: 'test-movie-1',
          description: 'This is a test movie description',
          duration_min: 120,
          category: 'Action',
          language: 'English',
          releaseDate: '2025-01-01',
          posterURL: {
            sm: '/images/poster1-sm.jpg',
            lg: '/images/poster1-lg.jpg'
          }
        },
        {
          _id: '2',
          name: 'Test Movie 2',
          slug: 'test-movie-2',
          description: 'Another test movie description',
          duration_min: 130,
          category: 'Comedy',
          language: 'English',
          releaseDate: '2025-02-01',
          posterURL: {
            sm: '/images/poster2-sm.jpg',
            lg: '/images/poster2-lg.jpg'
          }
        }
      ])
    });
  });

  await page.route('/api/movies?status=showing', route => {
    // Mock response for now showing movies
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: '1',
          name: 'Test Movie 1',
          slug: 'test-movie-1',
          description: 'This is a test movie description',
          duration_min: 120,
          category: 'Action',
          language: 'English',
          releaseDate: '2025-01-01',
          posterURL: {
            sm: '/images/poster1-sm.jpg',
            lg: '/images/poster1-lg.jpg'
          }
        }
      ])
    });
  });

  await page.route('/api/movies?status=upcoming', route => {
    // Mock response for upcoming movies
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          _id: '2',
          name: 'Test Movie 2',
          slug: 'test-movie-2',
          description: 'Another test movie description',
          duration_min: 130,
          category: 'Comedy',
          language: 'English',
          releaseDate: '2025-02-01',
          posterURL: {
            sm: '/images/poster2-sm.jpg',
            lg: '/images/poster2-lg.jpg'
          }
        }
      ])
    });
  });

  await browser.close();
}

export default globalSetup;
