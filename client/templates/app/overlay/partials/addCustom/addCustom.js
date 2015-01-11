Template.addCustom.created = function() {
  var instance = this;
  instance.customType = new ReactiveVar(Car);
}

Template.addCustom.helpers({
	getType: function(){
		return Type;
	},
	getMake: function(){
		return Template.instance().customType.get();
	}
});

Template.addCustom.events({
	'change #type': function(event,instance) {
		instance.customType.set( window[$(event.target).val()] );
  	}
});