/** @odoo-module */
import options from "@web_editor/js/editor/snippets.options";
options.registry.ImageHotspot = options.Class.extend({
selector: '.s_setting_quantity_c',

 events:{
            'click .reset-product-template-picker': '_onClickResetProductTemplatePicker',
            'click .reset-product-product-picker': '_onClickResetProductProductPicker',
        },

    setup() {
        this.state = useState({
            variants: [],
            fetchingVariants: false,
            productTemplate: localStorage.getItem("product_template") === "true",
            productVariant: localStorage.getItem("product_variant") === "true"
        });

        this.rpc = useService("rpc");

        onWillStart(async () => {
            await this.imageHotspot();
            await this._default_select_product();
        });
    },


        start() {
            this._super.apply(this, arguments);
        },


        async _default_select_product() {
            let product_template = localStorage.getItem("product_template") === "true";
            let product_variant = localStorage.getItem("product_variant") === "true";

            if (product_variant) {
                this._toggleVisibility('.product-template-row-button', true);
                this._toggleVisibility('.product-variant-row-button', false);
            }

            if (product_template) {
                this._toggleVisibility('.product-variant-row', false);
                this._toggleVisibility('.product-template-row-button', false);
                this._toggleVisibility('.product-variant-row-button', true);
            }

        },

        _toggleVisibility(selctor,hide){
       if (hide) {
            $(selctor).addClass('o_hidden');
        } else {
            $(selctor).removeClass('o_hidden');
        }
        },

        async setProductTemplate(previewMode, widgetValue, params) {
            if (!widgetValue) return;

            this.$target[0].dataset.producttemplateId = widgetValue;
            localStorage.setItem("product_template", "true");
            this.variants = [];
            this._toggleVisibility('.product-variant-row', false);
            this._toggleVisibility('.product-template-row-button', false);
            this._toggleVisibility('.product-variant-row-button', true);
            this._onClickResetProductProductPicker();
        },



        async setProductProduct(previewMode, widgetValue, params) {
            this.$target[0].dataset.productId = widgetValue;
            localStorage.setItem("product_variant", true)
            this._toggleVisibility('.product-template-row-button', true);
        this._toggleVisibility('.product-variant-row-button', false);
        },

        /**
         * Resets the product template selection
         *
         * @private
         */
        _onClickResetProductTemplatePicker() {
            this.$target[0].dataset.producttemplateId = '';
            this._toggleVisibility('.product-variant-row', true);
        this._toggleVisibility('.product-template-row-button', true);
        this._toggleVisibility('.product-variant-row-button', true);
            this.variants = [];
                       localStorage.setItem("product_template", false)
        },

        _onClickResetProductProductPicker() {
            this.$target[0].dataset.productId = '';
                             localStorage.setItem("product_variant", false)
        },

        _computeWidgetState(methodName, params) {
            switch (methodName) {
                case 'setProductTemplate': {
                    return this.$target[0].dataset.producttemplateId || '';
                }
                case 'setProductProduct': {
                    return this.$target[0].dataset.productId || '';
                }
            }
            return this._super(...arguments);
        },

        /**
         * @override
         */
        async _computeWidgetVisibility(widgetName, params) {
            switch (widgetName) {
                case 'product_template_reset_opt': {
                    return !!this.$target[0].dataset.producttemplateId;
                }
                case 'product_product_reset_opt': {
                    return !!this.$target[0].dataset.productId;
                }
            }
            return this._super(...arguments);
        },




imageHotspot: async function (previewMode, widgetValue, params) {
debugger;
    if (widgetValue === 'on' && !previewMode) {
        let target = this.$target[0].children[2];
        if (!target) {
            target = this.$target[0].parentElement;
            if (!target.classList.contains('s_setting_quantity_c')) {
                target.classList.add('s_setting_quantity_c');
            }
        }
        target.style.position = "relative";

        if (this.$target[0].dataset.productId) {
            const productId = parseInt(this.$target[0].dataset.productId);
            const response = await this.rpc("/web/dataset/call_kw", {
                model: 'product.product',
                method: 'get_variant_data',
                args: [productId],
                kwargs: {},
            });
            console.log('Variant response', response);
            if (response) {
                const newA = document.createElement('div');
                newA.innerHTML = `
                    <div class="hotspot" contenteditable="false">
                        <div class="hotspot-icon" contenteditable="false">
                            <i class="icon-double-circle"></i>
                        </div>
                        <div class="hotspot-content">
                            <div class="product-card">
                                <div class="row">
                                    <div class="col-6 col-sm-5 col-md-4 col-lg-5 mb-3 mb-sm-0">
                                         <div class="product-icon">
                                            <img src='data:image/png;base64,${response.image_1920}' alt="" class="product-image">
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-7 col-md-8 col-lg-7">
                                        <div class="product-content">
                                            <h4 class="mb-0 mb-sm-2">${response.name}</h4>
                                            <div class="row mb-0 mb-sm-2 px-2">
                                                <div class="col-12 col-md-6 mb-2 mb-md-0">
                                                    <div class="row">
                                                        <div class="col-12 col-lg-12 mt-2 col-sm-4">Price</div>
                                                        <div class="col-12 col-lg-12 mt-2 px-3 col-sm-4">${response.list_price}</div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-md-6">
                                                    <div class="row mt-0 mt-sm-2">
                                                        <div class="col-6 col-lg-12 px-2 px-sm-2">MFQ</div>
                                                        <div class="col-6 col-lg-12 px-2 px-sm-2">
                                                            <input type="number" class="qty_input input-qty" value="1"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button data-product-id="${response.id}" class="btn btn_custom s_add_to_quote_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                target.appendChild(newA);
            }
        }
    } else if (widgetValue === 'off' && !previewMode) {
        const target = this.$target[0];
        if (target.nextElementSibling && target.nextElementSibling.className === 'popup-product') {
            target.nextElementSibling.remove();
        }
    }
},






























//        imageHotspot: async function (previewMode, widgetValue, params) {
//    if (widgetValue === 'on' && !previewMode) {
//        let target = this.$target[0].children[2];
//        if (!target) {
//            target = this.$target[0].parentElement;
//            if (!target.classList.contains('s_setting_quantity_c')) {
//                target.classList.add('s_setting_quantity_c');
//            }
//        }
//        target.style.position = "relative";
//
//        if (this.$target[0].dataset.productId) {
//            const productId = parseInt(this.$target[0].dataset.productId);
//            const response = await this.rpc("/web/dataset/call_kw", {
//                model: 'product.product',
//                method: 'get_variant_data',
//                args: [productId],
//                kwargs: {},
//            });
//
//                    console.log('Variant response',response)
//                    if (response) {
//                        newA.innerHTML = `
//                        <div class="hotspot" contenteditable="false">
//                            <div class="hotspot-icon" contenteditable="false">
//                                <i class="fa fa-plus plus-icon"></i>
//                            </div>
//                            <div class="hotspot-content">
//                            <div class="product-card">
//                                <div class="row">
//                                    <div class="col-6 col-sm-5 col-md-4 col-lg-3 mb-3 mb-sm-0">
//                                         <div class="product-icon">
//                                            <img src='data:image/png;base64,${response.image_1920}' alt="" class="product-image">
//                                        </div>
//                                    </div>
//                                    <div class="col-6 col-sm-7 col-md-8 col-lg-9">
//                                         <div class="product-content">
//                                            <h4 class="mb-0 mb-sm-2">${response.name}</h4>
//                                            <div class="row mb-0 mb-sm-2 px-2">
//                                            <div class="col-12 col-md-6 mb-2 mb-md-0">
//                                              <div class="row">
//                                                        <div class="col-12 col-lg-5 mt-2 px-2 col-sm-4">Available Quantity</div>
//                                                <div class="col-12 col-lg-5 mt-2 px-3 col-sm-4">${response.quantity}</div>
//                                              </div>
//                                            </div>
//                                            <div class="col-12 col-md-6">
//                                                    <div class="row mt-0 mt-sm-2">
//                                                        <div class="col-6 col-lg-4 px-2 px-sm-2">MFQ</div>
//                                                        <div class="col-6 col-lg-4 px-2 px-sm-2">999</div>
//                                                    </div>
//                                            </div>
//                                            </div>
//                        <button data-product-id="${response.id}" class="btn btn_custom s_add_to_quote_btn">Add to Quote</button>
//                                            Add to Quote
//                                            </button>
//                                        </div>
//                                    </div>
//                                </div>
//                            </div>
//                            </div>
//                        </div>`;
//                    }
//                } else if (this.$target[0].dataset.producttemplateId) {
//            const templateId = parseInt(this.$target[0].dataset.producttemplateId);
//            const response = await this.rpc("/web/dataset/call_kw", {
//                model: 'product.template',
//                method: 'get_product_data',
//                args: [templateId],
//                kwargs: {},
//            });
//
//                        console.log("response", response);
//                    if (response) {
//                        let variantContent = '';
//
//                            variantContent += `
//                    <div class="product-card">
//                        <div class="row">
//                            <div class="col-6 col-sm-5 col-md-4 col-lg-3 mb-3 mb-sm-0">
//                                <div class="product-icon">
//                                    <img src='data:image/png;base64,${response.image_1920}' alt="" class="product-image">
//                                </div>
//                            </div>
//                            <div class="col-6 col-sm-7 col-md-8 col-lg-9">
//                                <div class="product-content">
//                                    <h4 class="mb-0 mb-sm-2">${response.name}</h4>
//                                    <div class="row mb-0 mb-sm-2">
//                                        <div class="col-12 col-md-6 mb-2 mb-md-0">
//                                            <div class="row">
//                                                <div class="col-12 col-lg-5 mt-2 px-3 col-sm-4">Available Quantity</div>
//                                                <div class="col-12 col-lg-5 mt-2 px-3 col-sm-4">${response.quantity}</div>
//                                            </div>
//                                        </div>
//                                        <div class="col-12 col-md-6">
//                                            <div class="row mt-0 mt-sm-2">
//                                                <div class="col-6 col-lg-4 px-2 px-sm-2">MFQ</div>
//                                                <div class="col-6 col-lg-4 px-2 px-sm-2">
//                                                 </div>
//                                            </div>
//                                        </div>
//                                    </div>
//                                    <button id="${response.id}" class="btn btn_custom s_add_to_quote_btn">
//                                        Add to Quote
//                                    </button>
//                                </div>
//                            </div>
//                        </div>
//                    </div>`;
//
//                        newA.innerHTML = `
//                <div class="hotspot" contenteditable="false">
//                    <div class="hotspot-icon" contenteditable="false">
//                        <i  class="fa fa-plus plus-icon"></i>
//                    </div>
//                    <div class="hotspot-content">
//                        ${variantContent}
//                    </div>
//                </div>`;
//                    }
//                }
//                target.appendChild(newA);
//            }
//            if (widgetValue == 'off' && previewMode === false) {
//                const target = this.$target[0]
//                if (target.nextElementSibling) {
//                    if (target.nextElementSibling.className == 'popup-product') {
//                        target.nextElementSibling.remove();
//                    }
//                }
//            }
//        },

        async setVertical(previewMode, widgetValue) {
            let target = this.$target;
            let value = parseFloat(widgetValue);
            target.css("top", `${value}%`);
        },
        async setHorizontal(previewMode, widgetValue) {
            let target = this.$target;
            let value = parseFloat(widgetValue);
            target.css("left", `${value}%`);
        },


    })
