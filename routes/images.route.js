const express = require('express');
const { auth } = require('../shared/middleware');
const { image } = require('../shared/models');
const mongoose = require('mongoose');

const router = express.Router();
const {
  gcloud: gcloudService,
  files: fileService
} = require('../shared/services');
const { status } = require('../shared/constants');
const {} = require('../shared/services');
const multer = require('multer');

const upload = multer({ dest: 'images[]/' });
const Image = mongoose.model('Image', image.ImageSchema);

router.post(
  '/upload',
  auth.verifyToken,
  upload.array('images[]'),
  async (req, res) => {
    try {
      const filePaths = req.files.map(file => file.path);
      await fileService.createThumbnails(filePaths);
      fileService.updateFilesWithOriginalMetadata(req);

      responseImages = await gcloudService.uploadFiles(filePaths);
      responseImages.forEach(responseImg => {
        const [file] = responseImg;
        const { size, name, bucket, mediaLink } = file.metadata;
        const multerFile = req.files.find(mFile => mFile.filename === name);

        if (multerFile) {
          const {
            originalLastModified: imageCreatedAt,
            originalTags: tags
          } = multerFile;

          const image = new Image({
            size,
            name,
            bucket,
            mediaLink,
            imageCreatedAt,
            tags
          });
          image.save();
        }
      });

      fileService.cleanUp(filePaths);
      res.sendStatus(status.OK);
    } catch (err) {
      res.statusMessage = err;
      res.sendStatus(status.INTERNAL_ERROR);
    }
  }
);

router.get('', auth.verifyToken, (req, res) => {
  const { tags, periodStart, periodEnd } = req.query;

  if (!tags && !periodStart && !periodEnd) {
    res.send([]);
  } else {
    const tagsRegExp = new RegExp(tags, 'i');

    Image.find(
      {
        tags: tags && tagsRegExp,
        imageCreatedAt: periodEnd &&
          periodStart && { $gt: periodStart, $lt: periodEnd }
      },
      (err, images) => {
        if (err) {
          res.sendStatus(status.INTERNAL_ERROR);
        } else {
          res.send(images);
        }
      }
    );
  }
});

module.exports = router;
