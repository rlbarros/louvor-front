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
    menus: {
        schedule: 'Agenda',
        musics: 'Musicas',
        interpreters: "Intépretes",
        configuration: 'Configuração',
        services: 'Cultos',
        genres: 'Gêneros',
        styles: 'Estilos',
        serviceTypes: 'Tipos de Cultos'

    },
    timeouts: {
        mock: 1500
    },
}