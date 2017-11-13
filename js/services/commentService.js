angular
.module('stack.service')
.factory('commentsService', ['$q', 'userService', '$http',  function ($q, userService, $http) {
        return {
            createComment: function(qModel, commentText){
                var authorId = userService.getUserModel()._id;
                var comment = {
                    text:commentText,
                    author:authorId,
                }
                return $http({
                    method: 'POST',
                    url: '/api/saveComment',
                    data: comment
                })
            }
        }
    }]);