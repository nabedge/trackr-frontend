define(['fixtures'], function(fixtures) {
    'use strict';
    return function($httpBackend) {
        $httpBackend.when('GET', '/api/principal').respond({
            id: 0,
            email: 'admin@techdev.de',
            enabled: true,
            authorities: [
                {authority: 'ROLE_ADMIN', order: 0, id: 0, screenName: 'Admin'}
            ]
        });

        /**
         * Mocks a request to an entity root that can contain parameters like page, sort, size (they will be ignored though).
         * Responds with data from the fixtures.
         * @param url The URL to mock, like '/api/companies'.
         */
        function mockRoot(url) {
            //base
            $httpBackend.whenGET(url).respond(fixtures[url]);
            //with query parameters
            var pattern = new RegExp('^' + url + '\\?.*$');
            $httpBackend.whenGET(pattern).respond(fixtures[url]);
        }

        mockRoot('/api/credentials');
        mockRoot('/api/contactPersons');
        mockRoot('/api/authorities');
        mockRoot('/api/projects');
        mockRoot('/api/employees');
        mockRoot('/api/companies');

        $httpBackend.when('GET', /^\/api\/credentials\/[\d]+$/).respond(fixtures['/api/credentials']._embedded.credentials[0]);
        $httpBackend.when('GET', /^\/api\/contactPersons\/[\d]+$/).respond(fixtures['/api/contactPersons']._embedded.contactPersons[0]);
        $httpBackend.when('GET', /^\/api\/authorities\/[\d]+$/).respond(fixtures['/api/authorities']._embedded.authorities[0]);
        $httpBackend.when('GET', /^\/api\/projects\/[\d]+$/).respond(fixtures['/api/projects']._embedded.projects[0]);
        $httpBackend.when('GET', /^\/api\/employees\/[\d]+$/).respond(fixtures['/api/employees']._embedded.employees[0]);
        $httpBackend.when('GET', /^\/api\/companies\/[\d]+$/).respond(fixtures['/api/companies']._embedded.companies[0]);

        $httpBackend.when('GET', /^\/api\/companies\/[\d]+\/address$/).respond(fixtures['/api/addresses']._embedded.addresses[0]);
        $httpBackend.when('GET', /^\/api\/companies\/[\d]+\/contactPersons/).respond(fixtures['/api/contactPersons']);

        $httpBackend.whenDELETE(/^\/api\/contactPersons\/\d+/).respond([204]);
        $httpBackend.whenPOST('/api/contactPersons').respond(function(method, url ,data) {
            return [201, data];
        });

        $httpBackend.whenPOST('/api/addresses').respond(function() {
            return [201, {
                _links: {
                    self: {
                        href: '/api/addresses/0'
                    }
                }
            }];
        });

        $httpBackend.whenPOST('/api/companies').respond(function(method, url ,data) {
            return [201, data];
        });

        var pattern = new RegExp('/api/companies/search/findByCompanyId\\?.*');
        $httpBackend.whenGET(pattern).respond(fixtures['/api/companies']);
    };
});