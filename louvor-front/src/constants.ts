export const constants = {
    _id: '_id',
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
                servicesMusics: 'service_musics',
                servicesTypes: 'service_types',
                services: 'services',
            }
        },
        report: {
            name: 'report',
            routes: {
                musicsByGenre: 'musicsByGenre',
                musicsByInterpreter: 'musicsByInterpreter'
            }
        }
    },
    id: 'id',
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
        servicesTypes: 'Tipos de Cultos',
        reports: 'Relatórios'
    },
    timeouts: {
        mock: 1500
    },
}