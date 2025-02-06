# -*- coding: utf-8 -*-
{
    'name': 'Advanced Legion HR-LinkedIn Integration',
    'summary': "Basic module for LnkedIn-HR Recruitment connector",
    'description': """The LinkedIn-HR Recruitment Connector Basic Module is
    designed to optimize your recruitment workflow, offering a comprehensive 
    suite of features to enhance candidate sourcing and selection.""",
    'category': 'Generic Modules/Human Resources',
    'version': "17.0.1.1",
    'depends': ['hr_recruitment', 'auth_oauth'],
    'author': 'Legion Soft',
    'company': 'Legion Soft',
    'maintainer': 'Byte Legion',
    'website': "https://lightgoldenrodyellow-pelican-600992.hostingersite.com",

    'data': [
        'data/auth_linkedin_data.xml',
        'security/ir.model.access.csv',
        'views/recruitment_config_settings.xml',
        'views/hr_job_linkedin_likes_comments_views.xml',
        'views/linkedin_comments_views.xml',
        'views/oauth_views.xml',
    ],
    'external_dependencies':
        {
        'python': ['mechanize', 'linkedin'],
        },
      'price': 29.99,
    'currency': 'USD',
    'images': ['static/description/banner.gif'],
    'license': 'OPL-1',
    'installable': True,
    'auto_install': False,
    'application': False,
}
