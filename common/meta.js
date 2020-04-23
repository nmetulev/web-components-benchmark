module.exports = {
    wc: [
        {
            name: 'LitElement',
            slug: 'lit-element',
            github: 'https://github.com/Polymer/lit-element',
            version: require('../todomvc/lit-element/package.json')
                .dependencies['lit-element'],
            stars: 2169,
            paths: ['lit-element/dist/bundle.js']
        },
        {
            name: 'FastElement',
            slug: 'fast-element',
            github: '',
            version: require('../todomvc/fast-element/package.json')
                .dependencies['@microsoft/fast-element'],
            stars: 0,
            paths: ['fast-element/dist/bundle.js']
        }
    ],
    fw: [
    ]
};