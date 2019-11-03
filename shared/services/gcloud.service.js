'use strict';

const { buckets } = require('../constants');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

module.exports = {
  async getFiles(bucketName = buckets.DEFAULT_BUCKET) {
    const [files] = await storage.bucket(bucketName).getFiles();
    return files;
  },

  async getFilesByPrefix({
    bucketName = buckets.DEFAULT_BUCKET,
    prefix,
    delimiter
  }) {
    const [files] = await storage
      .bucket(bucketName)
      .getFiles({ prefix, delimiter });
    return files;
  },

  async uploadFile(filename, bucketName = buckets.DEFAULT_BUCKET) {
    return storage.bucket(bucketName).upload(filename, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  },

  async uploadFiles(filenames, bucketName = buckets.DEFAULT_BUCKET) {
    return Promise.all(
      filenames.map(filename => this.uploadFile(filename, bucketName))
    );
  },

  async downloadFile(
    filename,
    destination = buckets.DEFAULT_DESTINATION,
    bucketName = buckets.DEFAULT_BUCKET
  ) {
    await storage
      .bitbucket(bucketName)
      .file(filename)
      .download({ destination });
  },

  async deleteFile(fileName) {
    await storage
      .bucket(bucketName)
      .file(fileName)
      .delete();
  }
};
