"use strict";

var commentUrl = 'https://api.parse.com/1/classes/input';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '3XOOun2PffbXeZ4nXCEMkySdnXcWOjZfbtLQtOqK';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'aov8DFdk0ATL4VatNJIeIiFmvPmyz0sG7KNUxyxI';
    })

    .controller('commentController', function($scope, $http) {
        $scope.newComment = {
            score: 0, 
            downvote: true,
        };

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentUrl + "?order=-score").success(function(data) {
                $scope.comments = data.results;
            })
            .finally(function() {
                $scope.loading = false;
             });
        };

        $scope.refreshComments();

        $scope.addNewComment = function() {
            $scope.loading = true;
            $http.post(commentUrl, $scope.newComment)
            .success(function(response) {
                 $scope.newComment.objectId = response.objectId;
                 $scope.comments.push($scope.newComment);
             })
             .finally(function() {
                 $scope.form.$setPristine();
                 $scope.newComment = {
                    score: 0, 
                    downvote: true,
                 };
                $scope.loading = false;
            })
        };

        $scope.changeScore = function(comment, amount) {
            if (amount == 1) {
                $scope.updateScore(comment, amount);
            } else if (comment.score == 0 && amount == -1) {
                comment.downvote = false;
            } else if (comment.downvote && amount == -1) {
                $scope.updateScore(comment, amount);
            }
        };

        $scope.updateScore = function(comment, amount) {
            $http.put(commentUrl + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            })
            .success(function (response) {
                comment.score = response.score;
            })
        };

        $scope.deleteComment = function(comment) {
            $http.delete(commentUrl + '/' + comment.objectId, comment)
            .success(function() {
                $scope.refreshComments();
            });
        };

    });