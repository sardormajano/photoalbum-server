const fs = require('fs');
const sharp = require('sharp');

module.exports = {
  cleanUp(filePaths) {
    filePaths.forEach(path =>
      fs.unlink(path, err => err && console.error(err))
    );
  },

  updateFilesWithOriginalMetadata({ files, body }) {
    const metadata = JSON.parse(body.metadata);

    files.forEach(file => {
      const theMetadata = metadata[file.originalname];
      file.originalLastModified = theMetadata.lastModified;
      file.originalTags = theMetadata.tags;
    });
  },

  createThumbnails(filePaths) {
    const promises = [];
    filePaths.forEach(path => {
      const thumbnailPath = `${path}-thumbnail`;
      promises.push(
        sharp(path)
          .resize(200)
          .toFile(thumbnailPath)
      );
      filePaths.push(thumbnailPath);
    });

    return Promise.all(promises);
  }
};
