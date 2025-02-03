from odoo import models, fields, api

class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def get_variant_data(self, variant_id):
        product = self.browse(variant_id)
        if product.exists():
            print("product", product)

            return {
                'id': product.id,
                'name': product.name,
                'list_price': product.list_price,
                'description': product.description_sale or '',
                'image_1920': product.image_1920,
                'quantity': product.qty_available,
            }
        return False