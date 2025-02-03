# -*- coding: utf-8 -*-
{
    'name': 'Dynamic Image Hotspot',
    'version': '17.0.1.0.0',
    'category': 'Website',
    'summary': 'Add dynamic hotspot for snippet images',
    'description': "The app allows users to add a hotspot for snippet images. ",
    'author': 'Kamran',
    'website': '',
    'depends': ['website_sale','web_editor'],
    'data': ['views/snippets/snippets.xml'],
    'assets': {
        'web.assets_frontend': [
            'dynamic_image_hotspot/static/src/css/style.css',
            'dynamic_image_hotspot/static/src/js/000.js',

        ],
        'website.assets_wysiwyg': [
            'dynamic_image_hotspot/static/src/js/snippet_options.js',

        ],
    },
    'images': ['static/description/icon.png'],
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
