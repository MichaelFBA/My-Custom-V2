Tags = new Mongo.Collection('tags');

Tags.allow({
  insert: function(doc) {
    return doc;
  }
});

Tags.initEasySearch(['tag'],{
    'limit' : 2000,
    'use' : 'mongo-db'
});


if (Meteor.isServer) {

    Meteor.methods({
        addTags: function(tags) {
            _.each(tags, function(value, key, list) {

                Tags.upsert({
                    // Selector
                    tag: value.replace("#", ""),
                }, {
                    // Modifier
                    $set: {
                        tag: value,
                        date: new Date()
                    },
                    $inc:{
                        count: 1
                    }
                },{
                    multi: true
                })

            });

        }
    })

}
