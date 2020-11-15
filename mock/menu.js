Mock.mock('/menu', {
    'dataSource|18': [{
        'key|+1': 1,
        'titles|2-4': [{
            name: '@cword(2,4)',
            href: '@url("http")'
        }],
        'content': {
            'tabs|2-5': [{
                name: '@cword(2,5)',
                href: '@url'
            }],
            'subs|8-15': [{
                'activity|1': ['', '每300减40', '199减100'],
                category: '@cword(2,3)',
                href: '@url',
                'items|8-20': [{
                    href: '@url',
                    name: '@cword(2,6)'
                }]
            }]
        }
    }]
});

Mock.mock('/hotwords', {
    'result|8-15': [{
        word: '@cword(2,5)',
        href: '@url(http)'
    }]
})

Mock.mock('/recommendWords', {
    text: '@cword(2,5)'
})