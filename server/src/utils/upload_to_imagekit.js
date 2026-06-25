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

const uploadFile = async (filePath) => {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const base64File = fileBuffer.toString('base64');

  // Prepare Form Data payload for ImageKit
  const data = new URLSearchParams();
  data.append('file', base64File);
  data.append('fileName', fileName);
  data.append('useUniqueFileName', 'false'); // Preserve exact original filename so our app maps easily

  try {
    const response = await axios.post('https://upload.imagekit.io/api/v1/files/upload', data, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(`✓ Uploaded ${fileName} successfully -> ${response.data.url}`);
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

  // Gather Images
  if (fs.existsSync(IMAGES_DIR)) {
    fs.readdirSync(IMAGES_DIR).forEach(file => {
      const fullPath = path.join(IMAGES_DIR, file);
      if (fs.statSync(fullPath).isFile() && !file.startsWith('.')) {
        filesToUpload.push(fullPath);
      }
    });
  }

  // Gather Audio
  if (fs.existsSync(AUDIO_DIR)) {
    fs.readdirSync(AUDIO_DIR).forEach(file => {
      const fullPath = path.join(AUDIO_DIR, file);
      if (fs.statSync(fullPath).isFile() && !file.startsWith('.')) {
        filesToUpload.push(fullPath);
      }
    });
  }

  console.log(`Found ${filesToUpload.length} files to upload.`);

  for (const filePath of filesToUpload) {
    await uploadFile(filePath);
    // Simple rate-limit friendliness
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\nUpload finished!');
};

run().catch(console.error);
