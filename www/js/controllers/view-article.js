var app = angular.module('starter.controllers')
.controller('lastArticleDetailCtrl', function($scope, $stateParams, ArticlesFactory, commonService) {
  //$scope.article = { }
  $scope.article = ArticlesFactory.get($stateParams.articleId);
  //debugger;
  commonService.setData($scope.article);
})
