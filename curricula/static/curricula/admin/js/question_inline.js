django.jQuery(function() {

  var listShownIframes = [];

  showQuestionIframe = function (id, iframeUrl) {

    var alreadyOpen = false;
    for (var i=0; i<listShownIframes.length; i++){
      if (listShownIframes[i].id == id){
        alreadyOpen = true;
        listShownIframes[i].iframe.remove();
        listShownIframes.splice(i, 1);
      }
    }

    if (!alreadyOpen){
      var iframe = django.jQuery('<tr><td colspan=\"7\"><div style=\"width: 100%;\"><iframe onload=\"this.width=screen.width*0.8;this.height=screen.height*0.5;\" src=\"' + iframeUrl + '\" frameborder=\"0\"></iframe></div></tr></td>');
      django.jQuery("#question-id-" + id).parents(':eq(2)').after(iframe)
      listShownIframes.push({'iframe': iframe, 'id': id});
    }
  }

});