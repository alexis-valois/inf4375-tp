 /*Source : http://stackoverflow.com/questions/21439529/jquery-ajax-call-click-event-submit-button*/
 $(document).ready(function(){
    $("#search").click(function(e){
        e.preventDefault();
        $.ajax(
        {
        	type: "GET",
            url: "/contrevenants",
            //data:
            success:function(result){
          		
        	}
    	});
    });
});