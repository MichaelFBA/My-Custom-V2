Slingshot.fileRestrictions("myFileUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 1*0x400*0x400, //1MB,
  authorize: function() {
    return this.userId
  }
});