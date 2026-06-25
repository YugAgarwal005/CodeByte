import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const URL_ENDPOINT = process.env.VITE_IMAGEKIT_URL_ENDPOINT;

if (!PRIVATE_KEY) {
  console.error('Error: IMAGEKIT_PRIVATE_KEY environment variable is not defined.');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(PRIVATE_KEY + ':').toString('base64');

const IMAGES_DIR = path.resolve(__dirname, '../../../client/src/assets/images');
const AUDIO_DIR = path.resolve(__dirname, '../../../client/src/assets/audio');

// List of essential files that are actually imported in the React app
const ESSENTIAL_FILES = [
  // Audio
  'correct.mp3',
  'wrong.mp3',
  'skip.mp3',
  // Images
  'loader.gif',
  'result.png',
  '4044.png',
  'follow.png',
  'clock.png',
  'upload.png',
  'icons8-firee.png',
  'fireee.png',
  'medal.png',
  'right.png',
  'xp.png',
  'followuser.png',
  'xpe.png',
  'league.png',
  'flow.png',
  'target.png',
  '404.png',
  'coins12.png',
  'welcome.gif',
  'unfollowfriend.png',
  'followfriend.png',
  'trophy.png',
  'logout.png',
  'switch.png',
  'icons8-home-64.png',
  'coins1.png',
  'icons8-treasure-100.png',
  'icons8-user-male-1001.png',
  'icons8-more-64.png',
  'icons8-module-481.png',
  'github-logo.png',
  'icons8-courses-64.png'
];

const uploadFile = async (filePath) => {
  const fileName = path.basename(filePath);
  if (!fs.existsSync(filePath)) {
    console.log(`- File not found locally: ${fileName}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const base64File = fileBuffer.toString('base64');

  const data = new URLSearchParams();
  data.append('file', base64File);
  data.append('fileName', fileName);
  data.append('useUniqueFileName', 'false');

  try {
    console.log(`Starting upload: ${fileName}...`);
    const response = await axios.post('https://upload.imagekit.io/api/v1/files/upload', data, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000 // 30s timeout per request
    });
    console.log(`✓ Uploaded ${fileName} -> ${response.data.url}`);
    return response.data;
  } catch (error) {
    console.error(`✗ Failed to upload ${fileName}:`, error.response?.data || error.message);
    return null;
  }
};

const run = async () => {
  console.log('Starting assets upload to ImageKit...');
  console.log('VITE_IMAGEKIT_URL_ENDPOINT:', URL_ENDPOINT || '(not defined)');
  
  const filesToUpload = [];

  ESSENTIAL_FILES.forEach(filename => {
    let fullPath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(AUDIO_DIR, filename);
    }
    if (fs.existsSync(fullPath)) {
      filesToUpload.push(fullPath);
    } else {
      console.warn(`Warning: Whitelisted file ${filename} not found in images or audio directories.`);
    }
  });

  console.log(`Found ${filesToUpload.length} / ${ESSENTIAL_FILES.length} whitelisted files locally.`);

  // Upload concurrently with a concurrency limit or in parallel (since we have 35 files)
  // Let's do batches of 5 to avoid overloading/rate limits, or do them sequentially but without delay.
  const batchSize = 5;
  for (let i = 0; i < filesToUpload.length; i += batchSize) {
    const batch = filesToUpload.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(filesToUpload.length / batchSize)}...`);
    await Promise.all(batch.map(file => uploadFile(file)));
  }

  console.log('\nUpload finished!');
};

run().catch(console.error);
