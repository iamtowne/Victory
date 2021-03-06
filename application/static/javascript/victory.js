(function() {
  var a, crashDocumentController, documentsController, groupedDocumentsController, indexController, settingsApplicationsController, settingsMenuController, settingsProfileController, settingsUsersController;

  a = angular.module('victory.controller', ['victory.provider']);

  indexController = function($scope) {
    /*
    /
    */

    if ($scope.victory.user.isLogin) {
      return location.href = '#/crashes/grouped';
    } else {
      return location.href = '#/login';
    }
  };

  indexController.$inject = ['$scope'];

  a.controller('IndexCtrl', indexController);

  settingsMenuController = function($scope, $state) {
    /*
    The controller of the settings menu
    */

    return $scope.active = $state.current.name;
  };

  settingsMenuController.$inject = ['$scope', '$state'];

  a.controller('SettingsMenuCtrl', settingsMenuController);

  a.controller('SettingsCtrl', function() {
    /*
    /settings
    */

    return location.href = '#/settings/applications';
  });

  settingsApplicationsController = function($scope, $victory, applications) {
    /*
    /settings/applications
    
    :scope name: new application name
    :scope description: new application description
    :scope items: [{id, name, newName, description, newDescription
                        app_key, create_time, is_owner, members:[{id, name, email, is_owner}]
                        }]
    */

    var item, _i, _len;
    for (_i = 0, _len = applications.length; _i < _len; _i++) {
      item = applications[_i];
      item.newName = item.name;
      item.newDescription = item.description;
    }
    $scope.items = applications;
    $scope.getApplications = function() {
      /*
      Get applications.
      */

      return $victory.setting.getApplications({
        success: function(data) {
          var _j, _len1, _ref;
          _ref = data.items;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            item = _ref[_j];
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
        var _j, _len1, _ref, _results;
        _ref = $scope.items;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          x = _ref[_j];
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
            var _j, _len1, _ref, _results;
            _ref = $scope.items;
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              x = _ref[_j];
              if (x.id === applicationId) {
                _results.push(x);
              }
            }
            return _results;
          })())[0];
          return application.members = (function() {
            var _j, _len1, _ref, _results;
            _ref = application.members;
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              x = _ref[_j];
              if (x.id !== memberId) {
                _results.push(x);
              }
            }
            return _results;
          })();
        }
      });
    };
  };

  settingsApplicationsController.$inject = ['$scope', '$victory', 'applications'];

  a.controller('SettingsApplicationsCtrl', settingsApplicationsController);

  settingsUsersController = function($scope, $victory, users) {
    /*
    /settings/users
    */

    $scope.items = users;
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
  };

  settingsUsersController.$inject = ['$scope', '$victory', 'users'];

  a.controller('SettingsUsersCtrl', settingsUsersController);

  settingsProfileController = function($scope, $injector, profile) {
    /*
    /settings/profile
    */

    var $rootScope, $victory;
    $victory = $injector.get('$victory');
    $rootScope = $injector.get('$rootScope');
    $scope.profile = profile;
    $scope.getProfile = function() {
      return $victory.setting.getProfile({
        success: function(data) {
          $rootScope.victory.user.name = data.name;
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
  };

  settingsProfileController.$inject = ['$scope', '$injector', 'profile'];

  a.controller('SettingsProfileCtrl', settingsProfileController);

  groupedDocumentsController = function($scope, $stateParams, documentMode, groupedDocumentsAndApplications) {
    /*
    :scope documentMode: <crashes/exceptions/logs>
    :scope keyword: search keywords
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope groupedDocuments: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max, hasPrevious, hasNext}
    */

    $scope.documentMode = documentMode;
    $scope.keyword = $stateParams.keyword ? $stateParams.keyword : '';
    $scope.applications = groupedDocumentsAndApplications.applications;
    $scope.groupedDocuments = groupedDocumentsAndApplications.groupedDocuments;
    $scope.page = groupedDocumentsAndApplications.page;
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
    $scope.clickGroupedDocument = function(groupedDocument) {
      /*
      Clicked the grouped document row in the table.
      */

      if (groupedDocument.times > 1 || $scope.documentMode === 'crashes') {
        return location.href = "#/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/" + groupedDocument.group_tag;
      }
    };
    return $scope.modal = function(groupedDocument) {
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
  };

  groupedDocumentsController.$inject = ['$scope', '$stateParams', 'documentMode', 'groupedDocumentsAndApplications'];

  a.controller('GroupedDocumentsCtrl', groupedDocumentsController);

  documentsController = function($scope, $victory, documentMode, documents) {
    /*
    /applications/<applicationId>/<documentMode>/<groupTag>
    */

    $scope.documentMode = documentMode;
    $scope.documents = documents;
    $victory.application.getApplications({
      success: function(data) {
        return $scope.applications = data.items;
      }
    });
    return $scope.renderDescription = function(document) {
      /*
      Render the description of the document.
      */

      if (document.description) {
        return document.description;
      } else if (document.parameters) {
        return "Parameters: " + document.parameters;
      } else if (document.url) {
        return "URL: " + document.url;
      }
      return "";
    };
  };

  documentsController.$inject = ['$scope', '$victory', 'documentMode', 'documents'];

  a.controller('DocumentsCtrl', documentsController);

  crashDocumentController = function($scope, $victory, documentMode, crash) {
    /*
    /applications/<applicationId>/<documentMode>/<groupTag>
    */

    $scope.documentMode = documentMode;
    $scope.crash = crash;
    return $victory.application.getApplications({
      success: function(data) {
        return $scope.applications = data.items;
      }
    });
  };

  crashDocumentController.$inject = ['$scope', '$victory', 'documentMode', 'crash'];

  a.controller('CrashDocumentCtrl', crashDocumentController);

}).call(this);

(function() {
  var a, vNavigation;

  a = angular.module('victory.directive', []);

  a.directive('vTooltip', function() {
    return {
      /*
      Show the bootstrap tool tip.
      */

      restrict: 'A',
      link: function(scope, element, attrs) {
        return attrs.$observe('vTooltip', function(value) {
          if (value) {
            $(element).attr('title', scope.$eval(value));
          }
          return $(element).tooltip();
        });
      }
    };
  });

  a.directive('vFocus', function() {
    return {
      /*
      Focus this element.
      */

      restrict: 'A',
      link: function(scope, element) {
        return $(element).select();
      }
    };
  });

  a.directive('vModal', function() {
    return {
      /*
      Find the first input text box then focus it on the bootstrap modal window.
      */

      restrict: 'A',
      link: function(scope, element) {
        return $(element).on('shown', function() {
          return $(this).find('input:first').select();
        });
      }
    };
  });

  a.directive('vEnter', function() {
    return {
      /*
      Eval the AngularJS expression when pressed `Enter`.
      */

      restrict: 'A',
      link: function(scope, element, attrs) {
        return element.bind("keydown keypress", function(e) {
          if (e.which === 13) {
            e.preventDefault();
            return scope.$apply(function() {
              return scope.$eval(attrs.vEnter);
            });
          }
        });
      }
    };
  });

  vNavigation = function($injector) {
    return {
      /*
      Setup the navigation effect.
      */

      restrict: 'A',
      link: function(scope, element) {
        var $selected, $victory, index, match, noop;
        $victory = $injector.get('$victory');
        scope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
          if (fromState.name !== "") {
            $victory.common.loading.on();
          }
          scope.select = toState.name;
          $('.modal.in').modal('hide');
          return setTimeout(function() {
            return $('#js_navigation li.select').mouseover();
          }, 0);
        });
        scope.$on('$stateChangeSuccess', function() {
          return $victory.common.loading.off();
        });
        scope.$on('$stateChangeError', function() {
          return $victory.common.loading.off();
        });
        if ($(element).find('li.select').length > 0) {
          $selected = $(element).find('li.select');
        } else {
          match = location.href.match(/\w\/([/#\w]*)/);
          index = match[1] === '' ? 0 : $(element).find("li a[href*='" + match[1] + "']").parent().index();
          $selected = $(element).find('li').eq(index);
        }
        $(element).find('li:first').parent().prepend($('<li class="cs_top"></li>'));
        $(element).find('li.cs_top').css({
          width: $selected.css('width'),
          left: $selected.position().left,
          top: $selected.position().top
        });
        noop = function() {};
        $(element).find('li[class!=cs_top]').hover(function() {
          return $(element).find('li.cs_top').each(function() {
            return $(this).dequeue();
          }).animate({
            width: this.offsetWidth,
            left: this.offsetLeft
          }, 420, "easeInOutCubic");
        }, noop());
        $(element).hover(noop(), function() {
          return $(element).find('li.cs_top').each(function() {
            return $(this).dequeue();
          }).animate({
            width: $(element).find('li.select').css('width'),
            left: $(element).find('li.select').position().left
          }, 420, "easeInOutCubic");
        });
      }
    };
  };

  vNavigation.$inject = ['$injector'];

  a.directive('vNavigation', vNavigation);

}).call(this);

(function() {
  angular.module('victory', ['victory.router', 'victory.directive']);

}).call(this);

(function() {
  var a,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  a = angular.module('victory.provider', []);

  a.provider('$victory', function() {
    var $http, $injector, $rootScope, pageSize,
      _this = this;
    pageSize = 20;
    $injector = null;
    $http = null;
    $rootScope = null;
    this.setupProviders = function(injector) {
      $injector = injector;
      $http = $injector.get('$http');
      return $rootScope = $injector.get('$rootScope');
    };
    this.setup = function() {
      NProgress.configure({
        showSpinner: false
      });
      if (sessionStorage.selectedApplication) {
        $rootScope.selectedApplication = JSON.parse(sessionStorage.selectedApplication);
      }
      return $rootScope.victory = window.victory;
    };
    this.common = {
      ajax: function(args) {
        var h,
          _this = this;
        if (args == null) {
          args = {};
        }
        /*
        victory ajax function
        :param args: {method, cache, data, error(), success(), beforSend(), hideLoadingAfterDown}
        */

        if (args.method == null) {
          args.method = 'get';
        }
        if (args.cache == null) {
          args.cache = false;
        }
        if (args.data == null) {
          args.data = '';
        }
        if (args.error == null) {
          args.error = function() {};
        }
        if (args.success == null) {
          args.success = function() {};
        }
        if (args.beforeSend) {
          args.beforeSend();
        }
        h = $http({
          url: args.url,
          method: args.method,
          cache: args.ache,
          data: args.data
        });
        h.error(function(data, status, headers, config) {
          _this.message.error(status);
          return args.error(data, status, headers, config);
        });
        return h.success(function(data, status, headers, config) {
          if (data.__status__ === 302 && data.location) {
            location.href = data.location;
            return;
          }
          return args.success(data, status, headers, config);
        });
      },
      message: {
        error: function(status) {
          /*
          pop error message.
          */

          switch (status) {
            case 400:
              return $.av.pop({
                title: 'Input Failed',
                message: 'Please check input values.',
                template: 'error'
              });
            case 403:
              return $.av.pop({
                title: 'Permission denied',
                message: 'Please check your permission.',
                template: 'error'
              });
            default:
              return $.av.pop({
                title: 'Error',
                message: 'Loading failed, please try again later.',
                template: 'error'
              });
          }
        }
      },
      loading: {
        /*
        Show/Hide loading effect.
        */

        on: function() {
          return NProgress.start();
        },
        off: function() {
          return NProgress.done();
        }
      }
    };
    this.setting = {
      getApplications: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get applications of the settings.
        :param args: {success()}
        */

        ajax = _this.common.ajax({
          url: '/settings/applications',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      addApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Add the application.
        :param args: {data:{name, description}, error(), success()}
        */

        return _this.common.ajax({
          method: 'post',
          url: '/settings/applications',
          data: args.data,
          error: args.error,
          success: args.success
        });
      },
      updateApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Update the application.
        :param args: {id, data:{name, description}, error(), success()}
        */

        return _this.common.ajax({
          method: 'put',
          url: "/settings/applications/" + args.id,
          data: args.data,
          error: args.error,
          success: args.success
        });
      },
      deleteApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the application by id.
        :param args: {id, success()}
        */

        return _this.common.ajax({
          method: 'delete',
          url: "/settings/applications/" + args.id,
          success: args.success
        });
      },
      inviteUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Invite the user into the application.
        :param args: {applicationId, email, success()}
        */

        return _this.common.ajax({
          method: 'post',
          url: "/settings/applications/" + args.applicationId + "/members",
          data: {
            email: args.email
          },
          success: args.success
        });
      },
      deleteMember: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the member from the application.
        :param args: {applicationId, memberId, success()}
        */

        return _this.common.ajax({
          method: 'delete',
          url: "/settings/applications/" + args.applicationId + "/members/" + args.memberId,
          success: args.success
        });
      },
      getUsers: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get users of the settings.
        :param args: {success()}
        */

        ajax = _this.common.ajax({
          url: '/settings/users',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      addUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Add an user.
        :param args: {email, success()}
        */

        return _this.common.ajax({
          method: 'post',
          url: '/settings/users',
          data: {
            email: args.email
          },
          success: args.success
        });
      },
      deleteUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the user by id.
        :param args: {id, success()}
        */

        return _this.common.ajax({
          method: 'delete',
          url: "/settings/users/" + args.id,
          success: args.success
        });
      },
      getProfile: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get the profile.
        :param args: {success()}
        */

        ajax = _this.common.ajax({
          url: '/settings/profile',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data;
        });
      },
      updateProfile: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Update the profile.
        :param args: {name, error(), success()}
        */

        return _this.common.ajax({
          method: 'put',
          url: '/settings/profile',
          data: {
            name: args.name
          },
          error: args.error,
          success: args.success
        });
      }
    };
    this.application = {
      getApplications: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Get applications.
        :param args: {success()}
        */

        return _this.common.ajax({
          url: "/applications",
          success: args.success
        });
      }
    };
    this.document = {
      getGroupedDocumentsAndApplications: function(args) {
        var ajaxApplications, result;
        if (args == null) {
          args = {};
        }
        /*
        Get grouped documents and applications for GroupedDocumentsCtrl.
        :param args: {documentMode, applicationId, keyword, index}
        :return: {applications, groupedDocuments, page}
        */

        args.applicationId = parseInt(args.applicationId);
        if (args.keyword == null) {
          args.keyword = '';
        }
        if (args.index == null) {
          args.index = 0;
        }
        result = {
          applications: null,
          groupedDocuments: null,
          page: {
            index: 0
          }
        };
        ajaxApplications = _this.common.ajax({
          url: '/applications'
        });
        return ajaxApplications.then(function(data) {
          var ajaxDocuments, x, _ref, _ref1;
          result.applications = data.data.items;
          if (result.applications.length > 0) {
            if (_ref = args.applicationId, __indexOf.call((function() {
              var _i, _len, _ref1, _results;
              _ref1 = result.applications;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                x = _ref1[_i];
                _results.push(x.id);
              }
              return _results;
            })(), _ref) >= 0) {
              $rootScope.selectedApplication = ((function() {
                var _i, _len, _ref1, _results;
                _ref1 = result.applications;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  x = _ref1[_i];
                  if (x.id === args.applicationId) {
                    _results.push(x);
                  }
                }
                return _results;
              })())[0];
              sessionStorage.selectedApplication = JSON.stringify($rootScope.selectedApplication);
            } else if (!$rootScope.selectedApplication || (_ref1 = $rootScope.selectedApplication.id, __indexOf.call((function() {
              var _i, _len, _ref2, _results;
              _ref2 = result.applications;
              _results = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                x = _ref2[_i];
                _results.push(x.id);
              }
              return _results;
            })(), _ref1) < 0)) {
              $rootScope.selectedApplication = result.applications[0];
              sessionStorage.selectedApplication = JSON.stringify($rootScope.selectedApplication);
            }
            ajaxDocuments = _this.document.getGroupedDocuments({
              applicationId: $rootScope.selectedApplication.id,
              documentMode: args.documentMode,
              keyword: args.keyword,
              index: args.index
            });
            return ajaxDocuments.then(function(data) {
              result.groupedDocuments = data.data.items;
              result.page = {
                total: data.data.total,
                index: args.index,
                max: (data.data.total - 1) / pageSize,
                hasPrevious: args.index > 0,
                hasNext: (parseInt(args.index) + 1) * pageSize < data.data.total
              };
              return result;
            });
          } else {
            return result;
          }
        });
      },
      getGroupedDocuments: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Get grouped documents
        :param args: {applicationId, documentMode, keyword, index success()}
        */

        if (args.keyword == null) {
          args.keyword = '';
        }
        if (args.index == null) {
          args.index = 0;
        }
        return _this.common.ajax({
          url: "/applications/" + $rootScope.selectedApplication.id + "/" + args.documentMode + "/grouped?q=" + args.keyword + "&index=" + args.index,
          success: args.success
        });
      },
      getDocuments: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get documents by the grouped tag.
        :param args: {applicationId, documentMode, groupTag, success()}
        */

        ajax = _this.common.ajax({
          url: "/applications/" + args.applicationId + "/" + args.documentMode + "/" + args.groupTag,
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      getCrashDocument: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get the crash document by the grouped tag.
        :param args: {applicationId, groupTag, success()}
        */

        ajax = _this.common.ajax({
          url: "/applications/" + args.applicationId + "/crashes/" + args.groupTag,
          success: args.success
        });
        return ajax.then(function(data) {
          var crash, thread, x, _i, _j, _len, _len1, _ref, _ref1;
          crash = data.data.crash;
          try {
            _ref = crash.report.crash.threads;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              thread = _ref[_i];
              if (thread.backtrace) {
                _ref1 = thread.backtrace.contents;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  x = _ref1[_j];
                  x.instruction_addr_hex = '0x' + ('00000000' + x.instruction_addr.toString(16)).slice(-8);
                }
              }
            }
          } catch (_error) {}
          try {
            crash.crashedThreads = (function() {
              var _k, _len2, _ref2, _results;
              _ref2 = crash.report.crash.threads;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                x = _ref2[_k];
                if (x.crashed) {
                  _results.push(x);
                }
              }
              return _results;
            })();
          } catch (_error) {}
          try {
            crash.threads = (function() {
              var _k, _len2, _ref2, _results;
              _ref2 = crash.report.crash.threads;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                x = _ref2[_k];
                if (!x.crashed) {
                  _results.push(x);
                }
              }
              return _results;
            })();
          } catch (_error) {}
          return crash;
        });
      }
    };
    this.get = function($injector) {
      this.setupProviders($injector);
      this.setup();
      return {
        common: this.common,
        setting: this.setting,
        application: this.application,
        document: this.document
      };
    };
    this.get.$inject = ['$injector'];
    this.$get = this.get;
  });

}).call(this);

(function() {
  var a, config, run;

  a = angular.module('victory.router', ['victory.controller', 'victory.provider', 'ui.router']);

  run = function($injector) {
    var $rootScope, $state, $stateParams;
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;
  };

  a.run(['$injector', run]);

  config = function($injector) {
    var $stateProvider, $urlRouterProvider;
    $stateProvider = $injector.get('$stateProvider');
    $urlRouterProvider = $injector.get('$urlRouterProvider');
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('index', {
      url: '/',
      templateUrl: '/views/empty.html',
      controller: 'IndexCtrl'
    });
    $stateProvider.state('login', {
      url: '/login',
      resolve: {
        title: function() {
          return 'Sign In - ';
        }
      },
      views: {
        viewContent: {
          templateUrl: '/views/login.html'
        }
      }
    });
    $stateProvider.state('settings', {
      url: '/settings',
      templateUrl: '/views/empty.html',
      controller: 'SettingsCtrl'
    });
    $stateProvider.state('settings-applications', {
      url: '/settings/applications',
      resolve: {
        title: function() {
          return 'Applications - Settings - ';
        },
        applications: [
          '$victory', function($victory) {
            return $victory.setting.getApplications();
          }
        ]
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/applications.html',
          controller: 'SettingsApplicationsCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('settings-users', {
      url: '/settings/users',
      resolve: {
        title: function() {
          return 'Users - Settings - ';
        },
        users: [
          '$victory', function($victory) {
            return $victory.setting.getUsers();
          }
        ]
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/users.html',
          controller: 'SettingsUsersCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('settings-profile', {
      url: '/settings/profile',
      resolve: {
        title: function() {
          return 'Profile - Settings - ';
        },
        profile: [
          '$victory', function($victory) {
            return $victory.setting.getProfile();
          }
        ]
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/profile.html',
          controller: 'SettingsProfileCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('grouped-crashes', {
      url: '/crashes/grouped',
      resolve: {
        title: function() {
          return 'Crashes - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        groupedDocumentsAndApplications: [
          '$victory', function($victory) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'crashes'
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-crashes-search', {
      url: '/applications/:applicationId/crashes/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Crashes - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        groupedDocumentsAndApplications: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'crashes',
              applicationId: $stateParams.applicationId,
              keyword: $stateParams.keyword,
              index: $stateParams.index
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('crash', {
      url: '/applications/:applicationId/crashes/:groupTag',
      resolve: {
        title: function() {
          return 'Crash - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        crash: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getCrashDocument({
              applicationId: $stateParams.applicationId,
              groupTag: $stateParams.groupTag
            });
          }
        ]
      },
      templateUrl: '/views/documents/crash.html',
      controller: 'CrashDocumentCtrl'
    });
    $stateProvider.state('grouped-exceptions', {
      url: '/exceptions/grouped',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        groupedDocumentsAndApplications: [
          '$victory', function($victory) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'exceptions'
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-exceptions-search', {
      url: '/applications/:applicationId/exceptions/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        groupedDocumentsAndApplications: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'exceptions',
              applicationId: $stateParams.applicationId,
              keyword: $stateParams.keyword,
              index: $stateParams.index
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('exceptions', {
      url: '/applications/:applicationId/exceptions/:groupTag',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        documents: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getDocuments({
              documentMode: 'exceptions',
              applicationId: $stateParams.applicationId,
              groupTag: $stateParams.groupTag
            });
          }
        ]
      },
      templateUrl: '/views/documents/list.html',
      controller: 'DocumentsCtrl'
    });
    $stateProvider.state('grouped-logs', {
      url: '/logs/grouped',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        groupedDocumentsAndApplications: [
          '$victory', function($victory) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'logs'
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-logs-search', {
      url: '/applications/:applicationId/logs/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        groupedDocumentsAndApplications: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getGroupedDocumentsAndApplications({
              documentMode: 'logs',
              applicationId: $stateParams.applicationId,
              keyword: $stateParams.keyword,
              index: $stateParams.index
            });
          }
        ]
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    return $stateProvider.state('logs', {
      url: '/applications/:applicationId/logs/:groupTag',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        documents: [
          '$victory', '$stateParams', function($victory, $stateParams) {
            return $victory.document.getDocuments({
              documentMode: 'logs',
              applicationId: $stateParams.applicationId,
              groupTag: $stateParams.groupTag
            });
          }
        ]
      },
      templateUrl: '/views/documents/list.html',
      controller: 'DocumentsCtrl'
    });
  };

  a.config(['$injector', config]);

}).call(this);

(function() {
  window.victory = {
    userLevel: {
      root: 0,
      normal: 1
    },
    loginUrl: '',
    logoutUrl: '',
    user: {
      userId: 0,
      level: 1,
      name: null,
      email: null,
      isLogin: false,
      isRoot: function() {
        return victory.user.level === victory.userLevel.root;
      }
    }
  };

}).call(this);
