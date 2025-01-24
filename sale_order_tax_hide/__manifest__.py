{
    "name": "Hide Taxes on Sale Order Line",
    "version": "18.0",
    "category": "Sales",
    "summary": "Hides the tax_id field from Sale Order Line in the Sale Order form.",
    "description": """
        This module customizes the Sale Order form by hiding the tax_id field 
        in the Sale Order Line to simplify the user interface for specific business needs.
    """,
    "author": "Hamza Pervaiz",
    "license": "LGPL-3",
    "depends": ["sale"],
    "data": [
        "views/sale_order_form_view.xml",
    ],
    'images': ['static/description/banner.png'],
    "installable": True,
    "application": False,
    "auto_install": False,
}
