{
    'name': 'Hide Powered By Odoo',
    'version': '17.0.1.0',
    'category': 'Tools',
    'license': 'LGPL-3',

    "author": "Legion Soft",
    "website": "http://www.legionsoft.com",
    'company': 'Legion Soft',

    'summary': """ Hide Powered By Odoo login screen, 
            This module modifies the functionality of emails to remove the Odoo branding.
            With this module it is possible to hide the two promotional link in the Portal purchase invoice view.            
            Hide Powered By Odoo On Settings.""",

    'description': """  Hide Powered By Odoo login screen, 
            This module modifies the functionality of emails to remove the Odoo branding.
            With this module it is possible to hide the two promotional link in the Portal purchase invoice view.            
            Hide Powered By Odoo On Settings. """,

    'depends': ['web', 'portal', 'auth_signup', 'mail', 'base_setup', 'base', 'sale'],

    'data': [
        'data/template_offers.xml',
        'views/power_by_odoo.xml',
        'views/login_templates.xml',

    ],
    'price': 9.99,
    'currency': 'USD',


    'demo': [],
    'application': True,
    'installable': True,
    'auto_install': False,
    'assets': {
        'web.assets_backend': [
            'legion_hide_powerd_by_odoo/static/src/js/web_client_patching.js',
        ],
    },
    'images': ['static/description/banner.gif'],

}
