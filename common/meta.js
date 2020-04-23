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
        },
        {
            name: 'FastElement',
            slug: 'fast-element',
            github: '',
            version: require('../todomvc/fast-element/package.json')
                .dependencies['@microsoft/fast-element'],
            stars: 0,
            paths: ['fast-element/dist/bundle.js']
        },
        {
            name: 'Stencil',
            slug: 'stencil',
            github: 'https://github.com/ionic-team/stencil',
            version: require('../todomvc/stencil/package.json').dependencies[
                '@stencil/core'
            ],
            stars: 5608,
            pathsTodo: [
                `stencil/dist/build/app.esm.js`,
                `stencil/dist/build/p-6f3fc90b.js`,
                `stencil/dist/build/my-todo_3.entry.js`
            ],
            pathsPascal: [
                `stencil/dist/build/app.esm.js`,
                `stencil/dist/build/p-f2464ba1.js`,
                `stencil/dist/build/pascal-triangle_2.entry.js`
            ]
        },
        {
            name: 'Svelte',
            slug: 'svelte',
            github: 'https://github.com/sveltejs/svelte',
            version: require('../todomvc/svelte/package.json').dependencies[
                'svelte'
            ],
            stars: 17839,
            paths: ['svelte/dist/bundle.js']
        }
    ],
    fw: [
    ]
};