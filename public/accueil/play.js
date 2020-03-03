var Polyvideos = angular.module('Polyvideos', []);

function mainController($scope,$http,$window){

    var v = sessionStorage.getItem("videoId");
	$scope.formData = {};

        $http.get('/play')
            .success(function(data){
                var v = sessionStorage.getItem("videoId");
                var x = document.getElementById('video');
                // var url = "https://www.youtube.com/embed/" + v + "?autoplay=1";
                var url = "https://www.youtube.com/embed/" + v;
                x.setAttribute("src", url);	
                console.log(x.getAttribute("src"));
            })

            .error(function(data){
                console.log('Error: ' + data);
            });
};