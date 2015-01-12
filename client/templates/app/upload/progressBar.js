Template.progressBar.helpers({
  progress: function () {
  	if(this.progress() == 1){
  		$('progress').remove()
  		return;
  	}else{
  		return Math.round(this.progress() * 100);
  	}
  }
});