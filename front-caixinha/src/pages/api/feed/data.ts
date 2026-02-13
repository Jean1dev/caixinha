const feedData = {
    data: [
        {
            id: '5e887fa38598b6fe61667757',
            author: {
                id: '5e88792be2d4cfb4bf0971d9',
                avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
                name: 'Siegbert Gottfried'
            },
            comments: [
                {
                    id: '5e887fb6c648772b52f860a8',
                    author: {
                        id: '5e8680e60cba5019c5ca6fda',
                        avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
                        name: 'Nasimiyu Danai'
                    },
                    createdAt: new Date().getTime(),
                    message: 'I\'ve been using Angular for the past 3 years'
                }
            ],
            createdAt: new Date().getTime(),
            isLiked: true,
            likes: 1,
            message: 'Hey guys! What\'s your favorite framework?'
        },
        {
            id: '5e887faca2b7a1ddce01221a',
            author: {
                id: '5e86809283e28b96d2d38537',
                avatar: '/assets/avatars/avatar-anika-visser.png',
                name: 'Anika Visser'
            },
            comments: [
                {
                    id: '5e887fc17162ba254da30771',
                    author: {
                        id: '5e887b7602bdbc4dbb234b27',
                        avatar: '/assets/avatars/avatar-jie-yan-song.png',
                        name: 'Jie Yan Song'
                    },
                    createdAt: new Date().getTime(),
                    message: 'Could use some more statistics, but that’s me haha'
                },
                {
                    id: '5e887fc759bebe8d5d54a2e5',
                    author: {
                        id: '5e887a1fbefd7938eea9c981',
                        avatar: '/assets/avatars/avatar-penjani-inyene.png',
                        name: 'Penjani Inyene'
                    },
                    createdAt: new Date().getTime(),
                    message: 'Hmm, honestly this looks nice but I would change the shadow though'
                }
            ],
            createdAt: new Date().getTime(),
            isLiked: true,
            likes: 24,
            media: 'https://aventurasnahistoria.uol.com.br/media/uploads/curiosidades/alegria_windows_xp.jpg',
            message: 'Just made this overview screen for a project, what-cha thinkin?'
        },
        {
            id: '5e887faf03e78a5359765636',
            author: {
                id: '5e86809283e28b96d2d38537',
                avatar: '/assets/avatars/avatar-anika-visser.png',
                name: 'Anika Visser'
            },
            comments: [
                {
                    id: '5e887fde4992eca63b9e9ef5',
                    author: {
                        id: '5e8877da9a65442b11551975',
                        avatar: '/assets/avatars/avatar-iulia-albu.png',
                        name: 'Iulia Albu'
                    },
                    createdAt: new Date().getTime(),
                    message: 'That’s actually deep. Thanks for the design, would you consider making an interaction?'
                },
                {
                    id: '5e887feb11b7add1ebfcca78',
                    author: {
                        id: '5e887b209c28ac3dd97f6db5',
                        avatar: '/assets/avatars/avatar-fran-perez.png',
                        name: 'Fran Perez'
                    },
                    createdAt: new Date().getTime(),
                    message: 'Oh... so sentimental'
                }
            ],
            createdAt: new Date().getTime(),
            isLiked: false,
            likes: 65,
            message: 'As a human being, you are designed in a way that makes you incapable of experiencing any positive emotion unless you set an aim and progress towards it. What makes you happy is not, in fact, attaining it, but making progress towards it.'
        }
    ],
    length: 3,
    hasMore: true
};
export default feedData;