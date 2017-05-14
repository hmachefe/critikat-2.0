angular.module('starter')
.filter('findImage', function () {
    return function (author) {
		var authorImages = {
			"Juliette Goffart": "JulietteGoffart.jpg",
			"Fabien Reyre": "FabienReyre.jpg",
			"Axel Scoffier": "AxelScoffier.jpg",
			"Marie Gueden": "MarieGueden.jpg",
      "Ophélie Wiel": "OphelieWiel.jpg",
      "Benoît Smith": "BenoitSmith.jpg",
      "Clément Graminiès": "ClementGraminies.jpg",
      "Olivia Cooper Hadjian": "OliviaCooperHadjian.jpg",
      "Romain Estorc": "RomainEstorc.jpg"
		}
		var imagePath = "img/writers/" + (authorImages[author] ? authorImages[author] : 'default.png');
		return imagePath;
	};
});
