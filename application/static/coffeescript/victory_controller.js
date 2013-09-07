// Generated by CoffeeScript 1.6.3
(function() {
  var c;

  c = angular.module('victory.controller', ['victory.service']);

  c.controller('NavigationCtrl', function($scope) {
    /*
    Navigation Controller
    
    :scope select: selected ui-router node name
    */

    var delay;
    delay = function(ms, func) {
      return setTimeout(func, ms);
    };
    return $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $scope.select = toState.name;
      $('.modal.in').modal('hide');
      return delay(0, function() {
        return $('#js_navigation li.select').mouseover();
      });
    });
  });

  c.controller('IndexCtrl', function() {
    /*
    /
    */

    if (!victory.user.isLogin) {
      return location.href = '#/login';
    }
  });

  c.controller('LoginCtrl', function($scope) {
    /*
    /login
    */

    return $scope.loginUrl = victory.loginUrl;
  });

  c.controller('SettingsMenuCtrl', function($scope, $state) {
    /*
    The controller of the settings menu
    */

    return $scope.active = $state.current.name;
  });

  c.controller('SettingsCtrl', function() {
    /*
    /settings
    */

    return location.href = '#/settings/applications';
  });

  c.controller('SettingsApplicationsCtrl', function($scope, $victory, httpApplications) {
    /*
    /settings/applications
    
    :scope name: new application name
    :scope description: new application description
    :scope items: [{id, name, newName, description, newDescription
                        app_key, create_time, is_owner, members:[{id, name, email, is_owner}]
                        }]
    */

    var item, _i, _len, _ref;
    _ref = httpApplications.data.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.newName = item.name;
      item.newDescription = item.description;
    }
    $scope.items = httpApplications.data.items;
    $scope.getApplications = function() {
      /*
      Get applications.
      */

      return $victory.setting.getApplications({
        success: function(data) {
          var _j, _len1, _ref1;
          _ref1 = data.items;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            item.newName = item.name;
            item.newDescription = item.description;
          }
          return $scope.items = data.items;
        }
      });
    };
    $scope.addApplication = function() {
      /*
      Add an application.
      */

      return $victory.setting.addApplication({
        data: {
          name: $scope.name,
          description: $scope.description
        },
        error: function(data, status) {
          if (status === 400 && data) {
            return $scope.errors = data;
          }
        },
        success: function() {
          $scope.name = '';
          $scope.description = '';
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.updateApplication = function(id) {
      /*
      Update the application.
      */

      var updateItem, x;
      updateItem = ((function() {
        var _j, _len1, _ref1, _results;
        _ref1 = $scope.items;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          x = _ref1[_j];
          if (x.id === id) {
            _results.push(x);
          }
        }
        return _results;
      })())[0];
      return $victory.setting.updateApplication({
        id: id,
        data: {
          name: updateItem.newName,
          description: updateItem.newDescription
        },
        error: function(data, status) {
          if (status === 400 && data) {
            return updateItem.errors = data;
          }
        },
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.deleteApplication = function(id) {
      /*
      Delete the application.
      */

      return $victory.setting.deleteApplication({
        id: id,
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.inviteUser = function(id, email) {
      /*
      Invite an user into the application.
      */

      return $victory.setting.inviteUser({
        applicationId: id,
        email: email,
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    return $scope.deleteMenter = function(applicationId, memberId) {
      /*
      Delete the member from the application.
      */

      return $victory.setting.deleteMember({
        applicationId: applicationId,
        memberId: memberId,
        success: function() {
          var application, x;
          application = ((function() {
            var _j, _len1, _ref1, _results;
            _ref1 = $scope.items;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              x = _ref1[_j];
              if (x.id === applicationId) {
                _results.push(x);
              }
            }
            return _results;
          })())[0];
          return application.members = (function() {
            var _j, _len1, _ref1, _results;
            _ref1 = application.members;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              x = _ref1[_j];
              if (x.id !== memberId) {
                _results.push(x);
              }
            }
            return _results;
          })();
        }
      });
    };
  });

  c.controller('SettingsUsersCtrl', function($scope, $victory, httpUsers) {
    /*
    /settings/users
    */

    $scope.items = httpUsers.data.items;
    $scope.getUsers = function() {
      /*
      Get users.
      */

      return $victory.setting.getUsers({
        success: function(data) {
          return $scope.items = data.items;
        }
      });
    };
    $scope.addUser = function() {
      /*
      Add an user.
      */

      return $victory.setting.addUser({
        email: $scope.email,
        success: function() {
          $scope.email = '';
          return $scope.getUsers();
        }
      });
    };
    return $scope.deleteUser = function(id) {
      /*
      Delete the user.
      */

      return $victory.setting.deleteUser({
        id: id,
        success: function() {
          var x;
          return $scope.items = (function() {
            var _i, _len, _ref, _results;
            _ref = $scope.items;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              if (x.id !== id) {
                _results.push(x);
              }
            }
            return _results;
          })();
        }
      });
    };
  });

  c.controller('SettingsProfileCtrl', function($scope, $victory, httpProfile) {
    /*
    /settings/profile
    */

    $scope.profile = httpProfile.data;
    $scope.getProfile = function() {
      return $victory.setting.getProfile({
        success: function(data) {
          return $scope.profile = data;
        }
      });
    };
    return $scope.updateProfile = function() {
      return $victory.setting.updateProfile({
        name: $scope.profile.name,
        error: function(data, status) {
          if (status === 400 && data) {
            return $scope.errors = data;
          }
        },
        success: function() {
          return $scope.getProfile();
        }
      });
    };
  });

  c.controller('GroupedDocumentsCtrl', function($scope, $victory, $state, $stateParams) {
    /*
    :scope documentMode: <crashes/exceptions/logs>
    :scope selectedApplication: the current application
    :scope keyword: search keywords
    :scope index: page index
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope groupedDocuments: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max, hasPrevious, hasNext}
    */

    if ($state.current.name.indexOf('exception') >= 0) {
      $scope.documentMode = 'exceptions';
    } else if ($state.current.name.indexOf('log') >= 0) {
      $scope.documentMode = 'logs';
    } else {
      $scope.documentMode = 'crashes';
    }
    $scope.page = {
      index: 0
    };
    if (sessionStorage.selectedApplication) {
      $scope.selectedApplication = JSON.parse(sessionStorage.selectedApplication);
    }
    $scope.getApplications = function() {
      /*
      Get applications, then get grouped documents.
      */

      return $victory.ajax({
        url: '/applications',
        hideLoadingAfterDone: false,
        success: function(data) {
          var x, _ref;
          $scope.applications = data.items;
          if (data.items.length > 0) {
            if (!$scope.selectedApplication || ((_ref = $scope.selectedApplication.id) !== (function() {
              var _i, _len, _ref1, _results;
              _ref1 = data.items;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                x = _ref1[_i];
                _results.push(x.id);
              }
              return _results;
            })())) {
              $scope.selectedApplication = data.items[0];
              sessionStorage.selectedApplication = JSON.stringify($scope.selectedApplication);
            }
            return $scope.searchGroupedDocuments('', $stateParams.index);
          } else {
            return victory.loading.off();
          }
        }
      });
    };
    $scope.searchGroupedDocuments = function(keyword, index) {
      if (keyword == null) {
        keyword = '';
      }
      if (index == null) {
        index = 0;
      }
      /*
      Search grouped documents with keywords.
      */

      return $victory.ajax({
        url: "/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/grouped?q=" + keyword + "&index=" + index,
        success: function(data) {
          $scope.groupedDocuments = data.items;
          return $scope.page = {
            total: data.total,
            index: index,
            max: (data.total - 1) / $victory.pageSize,
            hasPrevious: index > 0,
            hasNext: (index + 1) * $victory.pageSize < data.total
          };
        }
      });
    };
    $scope.getGroupedDocumentsUrl = function(keyword, index) {
      if (index == null) {
        index = 0;
      }
      /*
      Get the url of grouped documents.
      */

      return "#/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/grouped/" + keyword + "/" + index;
    };
    $scope.gotoSearchPage = function(keyword, index) {
      if (index == null) {
        index = 0;
      }
      /*
      Goto the search page of grouped documents.
      */

      return location.href = $scope.getGroupedDocumentsUrl(keyword, index);
    };
    $scope.getGroupedDocumentUrl = function(groupedDocument) {
      /*
      Get the href of the grouped document.
      :param groupedDocument: grouped document
      :return: "#/applications/{{application_id}}/{{documentMode}}/{{group_tag}}" / "#document_{{group_tag}}"
      */

      if (groupedDocument.times > 1) {
        return "#/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/" + groupedDocument.group_tag;
      } else {
        return "#document_" + groupedDocument.group_tag;
      }
    };
    $scope.modal = function(groupedDocument) {
      /*
      Check the grouped document should show the bootstrap modal window.
      :param groupedDocument: grouped document
      :return: "modal" / ""
      */

      if (groupedDocument.times > 1) {
        return "";
      } else {
        return "modal";
      }
    };
    if ($stateParams.keyword) {
      $scope.keyword = $stateParams.keyword;
      return $scope.searchGroupedDocuments($stateParams.keyword, $stateParams.index);
    } else {
      $scope.keyword = '';
      return $scope.getApplications();
    }
  });

}).call(this);
