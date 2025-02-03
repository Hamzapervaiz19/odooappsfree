/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import WebsiteSale from '@website_sale_stock/js/website_sale';
import { cartHandlerMixin } from "@website_sale/js/website_sale_utils";

const ImageHotspot = publicWidget.Widget.extend(cartHandlerMixin, {
    selector: '.s_setting_quantity_c',
    events: {
        'mouseenter .hotspot': '_hotspotposition',
        'click .s_add_to_quote_btn': '_onClickAddToQuote',
    },

    init: function () {
        this._super.apply(this, arguments);
        this.rpc = this.bindService("rpc");
    },

    start: function () {
        return this._super.apply(this, arguments);
    },

    _hotspotposition: function(ev) {
        const hotspot = ev.currentTarget;
        const content = hotspot.querySelector('.hotspot-content');
        const content_card = hotspot.querySelector('.product-card');

        if (!content || !content_card) {
            console.log('Required elements not found');
            return;
        }

        content.style.position = "absolute";
        content.style.top = "auto";
        content.style.left = "auto";
        content.style.right = "auto";
        content.style.bottom = "auto";

        const parent = hotspot.offsetParent;
        const contentRect = content_card.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        if (contentRect.right > parentRect.right) {
            content.style.left = "auto";
            content.style.right = "0";
        }
        if (contentRect.bottom > parentRect.bottom) {
            content.style.top = "auto";
            content.style.bottom = "0";
        }
    },

    /**
     * Handle add to cart button click
     * @private
     * @param {Event} ev
     */
    _onClickAddToQuote: async function (ev) {
        ev.preventDefault();
        const $button = $(ev.currentTarget);
        const productId = $button.data('product-id');

        const $productCard = $button.closest('.product-card');
        const $quantityInput = $productCard.find('.qty_input');
        const quantity = parseFloat($quantityInput.val()) || 1.0;

        try {
            await this.addToCart({
                product_id: productId,
                add_qty: quantity,
            });

        } catch (error) {
            console.error('Failed to add product to cart:', error);
        }
    },

});

publicWidget.registry.ImageHotspot = ImageHotspot;

export default ImageHotspot;
