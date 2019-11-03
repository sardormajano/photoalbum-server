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

router.get('', auth.verifyToken, (req, res) => {
  res.send('this is images ROOT');
});

router.post(
  '/upload',
  auth.verifyToken,
  upload.array('images[]'),
  async (req, res) => {
    try {
      responseImages = await gcloudService.uploadFiles(
        req.files.map(file => file.path)
      );

      fileService.updateFilesWithOriginalMetadata(req);

      responseImages.forEach(responseImg => {
        const [file] = responseImg;
        const { size, name, bucket, mediaLink } = file.metadata;
        const {
          originalLastModified: imageCreatedAt,
          originalTags: tags
        } = req.files.find(mFile => mFile.filename === name);

        const image = new Image({
          size,
          name,
          bucket,
          mediaLink,
          imageCreatedAt,
          tags
        });
        image.save();
      });

      fileService.cleanUp(req.files);

      res.sendStatus(status.OK);
    } catch (err) {
      res.sendStatus(status.INTERNAL_ERROR);
    }
  }
);

module.exports = router;
