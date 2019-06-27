import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { StorageAmazonS3 } from '../StorageAmazonS3';
dotenv.config();

const bucketName = 'aap-en-beer';
const configS3 = {
  bucketName,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const s3 = new StorageAmazonS3(configS3);

const clearBucket = async () => {
  const d = await s3.clearBucket();
  console.log(d);
};
// clearBucket();

const listFiles = async () => {
  const d = await s3.listFiles();
  console.log(d);
};
// listFiles();

const getFileAsReadable = (fileName: string) => {
  s3.getFileAsReadable(fileName)
    .then(readStream => {
      const filePath = path.join('/home/abudaan/Downloads/tmp/', fileName);
      const writeStream = fs.createWriteStream(filePath);
      readStream.pipe(writeStream);
      writeStream.on('error', (e: Error) => {
        console.log(e.message);
      });
      writeStream.on('finish', () => {
        console.log('FINISHED');
      });
    })
    .catch(e => { console.log(e); });
};
// getFileAsReadable('sun-blanket.jpg');
// getFileAsReadable('/generate_error/IMG_9643.jpg');

const getFileAsReadable2 = async (fileName: string) => {
  const readStream = await s3.getFileAsReadable(fileName)
    .catch(e => { console.log(e); });

  if (!readStream) {
    return;
  }
  console.log(readStream);
  const filePath = path.join('/home/abudaan/Downloads/tmp/', fileName);
  const writeStream = fs.createWriteStream(filePath);
  readStream.pipe(writeStream);
  writeStream.on('error', (e: Error) => {
    console.log(e.message);
  });
  writeStream.on('finish', () => {
    console.log('FINISHED');
  });
};
// getFileAsReadable2('sun-blanket.jpg');
// getFileAsReadable2('IMG_9643.jpg');

const getFileAsReadable3 = async (fileName: string) => {
  const readStream = await s3.getFileAsReadable(fileName);
  if (readStream !== null) {
    const filePath = path.join('/home/abudaan/Downloads/tmp/', fileName);
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);
    writeStream.on('error', (e: Error) => {
      console.log(e.message);
    });
    writeStream.on('finish', () => {
      console.log('FINISHED');
    });
  }
};
// getFileAsReadable3('sun-blanket.jpg');
// getFileAsReadable3('IMG_9643.jpg');

const addFileFromPath = async (path: string, newFileName?: string) => {
  const d = await s3.addFileFromPath(path, { name: newFileName });
  console.log(d);
};
// addFileFromPath('/home/abudaan/Pictures/sun-blanket.jpg', 'aapenbeer.jpg')
// addFileFromPath('/home/abudaan/Pictures/sun-blanket.jpg', 'test/aapenbeer.jpg')

const removeFile = async (fileName: string) => {
  // try {
  //   const d = await s3.removeFile(fileName)
  //   console.log(d);
  // } catch (e) {
  //   console.log('error');
  // }
  s3.removeFile(fileName)
    .then(d => {
      console.log(d);
    })
    .catch(e => {
      console.log(e);
    });

};
removeFile('subdir/renamed.jpg');
// removeFile('aapenbeer.jpg')
