// Generated by CoffeeScript 1.6.3
(function() {
  var r;

  r = angular.module('victory.router', ['victory.controller', 'victory.service', 'victory.directive', 'ui.router', 'ui.state', 'ngProgress']);

  r.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;
  });

  r.config(function(ngProgressProvider) {
    /*
    Setup settings of ngProgress.
    */

    ngProgressProvider.setColor('white');
    return ngProgressProvider.setHeight('2px');
  });

  r.config(function($stateProvider, $urlRouterProvider) {
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
          templateUrl: '/views/login.html',
          controller: 'LoginCtrl'
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
        applications: function($victory) {
          return $victory.setting.getApplications();
        }
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
        users: function($victory) {
          return $victory.setting.getUsers();
        }
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
        profile: function($victory) {
          return $victory.setting.getProfile();
        }
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
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'crashes'
          });
        }
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
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'crashes',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
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
        crash: function($victory, $stateParams) {
          return $victory.document.getCrashDocument({
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
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
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'exceptions'
          });
        }
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
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'exceptions',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
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
        documents: function($victory, $stateParams) {
          return $victory.document.getDocuments({
            documentMode: 'exceptions',
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
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
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'logs'
          });
        }
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
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'logs',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
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
        documents: function($victory, $stateParams) {
          return $victory.document.getDocuments({
            documentMode: 'logs',
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
      },
      templateUrl: '/views/documents/list.html',
      controller: 'DocumentsCtrl'
    });
  });

}).call(this);