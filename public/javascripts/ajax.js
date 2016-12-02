$("#errors").html('');
var replaceContrevenantTable = function(data){
	$("#errors").html('');
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

var afficherErreur = function(){
	$("#errors").html('<p><h3><span>Une erreur est survenue en communiquant avec le serveur.</span></h3></p>');
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
			error: afficherErreur,
			success : replaceContrevenantTable
		});
	});

});