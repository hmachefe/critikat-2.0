angular.module('starter')
.filter('findImage', function () {
    return function (author) {
		var authorImages = {
			"Juliette Goffart": "JulietteGoffart.jpg",
			"Fabien Reyre": "FabienReyre.jpeg",
			"Axel Scoffier": "AxelScoffier.jpg",
			"Marie Gueden": "MarieGueden.jpg",
      "Ophélie Wiel": "OphelieWiel.jpg",
      "Benoît Smith": "BenoitSmith.jpg",
      "Clément Graminiès": "ClementGraminies.jpg"
		}
		var imagePath = "img/writers/" + (authorImages[author] ? authorImages[author] : 'default.png');
		return imagePath;
	};
});
