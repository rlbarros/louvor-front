export const constants = {
    api: 'api',
    domains: {
        auth: {
            name: 'auth',
            routes: {
                login: 'login'
            }
        },
        music: {
            name: 'music',
            routes: {
                genres: 'genres',
                interpreters: 'interpreters',
                musics: 'musics',
                styles: 'styles',
            }
        },
        service: {
            name: 'service',
            routes: {
                servicesMusics: 'servicesMusics',
                servicesTypes: 'servicesTypes',
                services: 'services',
            }
        }
    },
    routes: {
        login: '/login',
        home: '/'
    },
    timeouts: {
        mock: 1500
    },
}