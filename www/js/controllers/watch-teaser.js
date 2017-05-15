var app = angular.module('starter.controllers')
.controller('teaserCtrl', function($scope, $stateParams, $sce, commonService) {
  commonService.resizeVideo();
  $scope.getArticleTitle = function() {
    //debugger;
    var article = commonService.getData();
    //debugger;
    return article.title;
  };
  $scope.getArticleVideoFrameUrlId = function() {
    //debugger;
    var article = commonService.getData();
    console.log('getArticleVideoFrameUrlId  :  article.videoFrameUrlId == ', article.videoFrameUrlId);
    return $sce.trustAsResourceUrl(article.videoFrameUrlId);
  }

});
