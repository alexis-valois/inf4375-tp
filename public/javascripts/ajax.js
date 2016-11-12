var replaceContrevenantTable = function(data){
	if (data.length > 0){
		$("#etablissementsInfractions").html('');
		for (var i = 0; i < data.length; i++){
			$("#etablissementsInfractions").append('<tr>');
			$("#etablissementsInfractions").append('<td>' + data[i].proprietaire + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].etablissement + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].adresse + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].ville + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].description + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].date_infraction + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].date_jugement + '</td>');
			$("#etablissementsInfractions").append('<td>' + data[i].montant + '</td>');
			$("#etablissementsInfractions").append('</tr>');
		}
	}
}

$(function(){
	$("#search").click(function(){
		var dateDebut = $("#debut").val();
  		var dateFin = $("#fin").val();
		$.ajax({
			url: "/contrevenants",
			type: "GET",
			data: {du: dateDebut, au: dateFin},
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown){
				alert(errorThrown);
			},
			success : replaceContrevenantTable
		});
	});

});