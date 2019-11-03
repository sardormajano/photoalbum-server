const fs = require('fs');

module.exports = {
  cleanUp(files) {
    files.forEach(file => {
      fs.stat(file.path, (err, stat) => {
        fs.unlink(file.path, err => err && console.error(err));
      });
    });
  },

  updateFilesWithOriginalMetadata({ files, body }) {
    const metadata = JSON.parse(body.metadata);

    files.forEach(file => {
      const theMetadata = metadata[file.originalname];
      file.originalLastModified = theMetadata.lastModified;
      file.originalTags = theMetadata.tags;
    });
  }
};
