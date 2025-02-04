# -*- coding: utf-8 -*-
{
    'name': "Drag And Drop Binary Field Widget",
    'version': '17.0.1.0',
    "summary": """  
        The Drag and Drop Binary Field Widget for Odoo is a custom widget that enhances the user experience when 
        dealing with binary fields. 
    """,
    "description": """
        The Drag and Drop Binary with copy paste Field Widget for Odoo is a custom widget that enhances the user experience when 
        dealing with binary fields. 
        """,
    'license': 'OPL-1',
    'price': 0,
    'currency': 'EUR',
    'author': "Byte Legions",
    'images': [
        'static/description/main.png',
    ],
    'category': 'Tools',
    'depends': ['base_setup','web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'legion_drag_and_drop_binary_field/static/src/js/field_binary.js',
            'legion_drag_and_drop_binary_field/static/src/js/field_image.js',
            'legion_drag_and_drop_binary_field/static/src/js/many.js',
            'legion_drag_and_drop_binary_field/static/src/css/style.css',
        ],
    },
        'images': ['static/description/banner.gif'],
    "post_load": None,
    "pre_init_hook": None,
    "post_init_hook": None,
    "auto_install": False,
    "installable": True,
}
