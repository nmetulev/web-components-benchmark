module.exports = {
    wc: [{
            name: 'Native',
            slug: 'native',
            version: '',
            github: 'https://github.com/webcomponents/webcomponentsjs',
            stars: '',
            paths: ['native/dist/bundle.js']
        },
        {
            name: 'LitElement',
            slug: 'lit-element',
            github: 'https://github.com/Polymer/lit-element',
            version: require('../todomvc/lit-element/package.json')
                .dependencies['lit-element'],
            stars: 2169,
            paths: ['lit-element/dist/bundle.js']
        }
    ],
    fw: [
    ]
};