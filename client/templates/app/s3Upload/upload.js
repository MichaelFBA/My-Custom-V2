Template.s3_upload.events({
    "click button.upload": function(){
        var files = $("input.file_bag")[0].files
        S3.upload(files,"/uploads",function(e,r){
            console.log(r);
        });
    }
})

Template.s3_upload.helpers({
    "files": function(){
        return S3.collection.find();
    }
})