const artillery = require("@pe/artillery-kit").ArtilleryTest;
const constants = require("../constants");
const fs = require("fs");
const FormData = require("form-data");

function defineVariables(context, events, done) {
  context.vars.businessId = constants.BUSINESS_ID;
  context.vars.postDataImage = encodeURIComponent(`{"type":"media", "content":"new content", "mediaType":"image", "channelSet":[], "status":"postnow"}`);
  context.vars.postDataVideo = encodeURIComponent(`{"type":"media", "content":"new content", "mediaType":"video", "channelSet":[], "status":"postnow"}`);
  context.vars.postDataMessage = encodeURIComponent(`{"type":"post", "content":"new content", "mediaType":"none", "channelSet":[], "status":"postnow"}`);
  context.vars.postDataImageJson = {
    "type": "media",
    "content": "new content",
    "media": [
      "image"
    ],
    "channelSet": [],
    "status": "postnow",
    "toBePostedAt": "2023-05-17T14:57:22.477Z",
    "postedAt": "2023-05-17T14:57:22.477Z",
  };
  return done();
}

function setFormDataMessage(requestParams, context, ee, next) {
  let formData = new FormData();

  requestParams.body = formData;

  return next();
}

function setFormDataImage(requestParams, context, ee, next) {
  let formData = new FormData();
  formData.append(
    "chair",
    fs.createReadStream(__dirname + "/../files/chair.jpeg")
  );

  requestParams.body = formData;

  return next();
}

function setFormDataMultipleImages(requestParams, context, ee, next) {
  let formData = new FormData();
  formData.append(
    "chair",
    fs.createReadStream(__dirname + "/../files/chair.jpeg")
  );
  formData.append(
    "chair1",
    fs.createReadStream(__dirname + "/../files/chair.jpeg")
  );
  formData.append(
    "chair2",
    fs.createReadStream(__dirname + "/../files/chair.jpeg")
  );
  formData.append(
    "chair3",
    fs.createReadStream(__dirname + "/../files/chair.jpeg")
  );

  requestParams.body = formData;

  return next();
}

function setFormDataSmallVideo(requestParams, context, ee, next) {
  let formData = new FormData();
  formData.append(
    "test",
    fs.createReadStream(__dirname + "/../files/test.mp4")
  );

  requestParams.body = formData;

  return next();
}


module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  getBusinessId: artillery.helper.getBusinessId,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
  setFormDataMessage,
  setFormDataImage,
  setFormDataMultipleImages,
  setFormDataSmallVideo,
};
