odoo.define('legion_dynamic_image_hotspot.CustomMany2oneUserValueWidget', function (require) {
    "use strict";
    var options = require('web_editor.snippets.options');
    var widgetRegistry = options.userValueWidgetsRegistry
    var Many2oneUserValueWidget = widgetRegistry['we-many2one'];
    var ButtonUserValueWidget = widgetRegistry['we-button'];

    var CustomMany2oneUserValueWidget = Many2oneUserValueWidget.extend({
        start: function () {
            return this._super.apply(this, arguments);
        },
        async _search(needle, searchMore = false) {
            try {

                    this.options.limit = 99999;

                await this._super(needle, searchMore);

                const recTuples = await this._rpc({
                    model: this.options.model,
                    method: 'name_search',
                    kwargs: {
                        name: needle,
                        args: await this._getSearchDomain(),
                        operator: "ilike",
                        limit: this.options.limit,
                    },
                });

                if (!recTuples.length) {
                    this.searchMore.classList.add('d-none');
                    return;
                }

                const recordIds = recTuples.map(([id, _name]) => id);
                const records = await this._rpc({
                    model: this.options.model,
                    method: 'read',
                    args: [recordIds, this.options.fields],
                });

                this._userValueWidgets.filter(widget => {
                    return widget instanceof ButtonUserValueWidget &&
                        !widget.isDestroyed() &&
                        widget.el.parentElement.matches('we-selection-items');
                }).forEach(button => {
                    if (button.isPreviewed()) {
                        button.notifyValueChange('reset');
                    }
                    button.destroy();
                });

                this._userValueWidgets = this._userValueWidgets.filter(widget => !widget.isDestroyed());

                records.forEach(record => {
                    this.displayNameCache[record.id] = record.display_name;
                });

                await Promise.all(records.slice(0, this.options.limit).map(async record => {
                    const buttonDataAttributes = Object.assign({}, this.options.dataAttributes);
                    Object.keys(buttonDataAttributes).forEach(key => {
                        buttonDataAttributes[key] = buttonDataAttributes[key] || record[this.options.callWith];
                    });

                    const buttonWidget = new ButtonUserValueWidget(this, undefined, {
                        dataAttributes: Object.assign({recordData: JSON.stringify(record)}, buttonDataAttributes),
                        childNodes: [document.createTextNode(record.display_name)],
                    }, this.$target);

                    this.registerSubWidget(buttonWidget);
                    await buttonWidget.appendTo(this.menuEl);

                    if (this._methodsNames) {
                        buttonWidget.loadMethodsData(this._methodsNames);
                    }
                }));

                if (this._methodsNames) {
                    this._methodsNames.forEach(methodName => {
                        this.setValue(this._value, methodName);
                    });
                }

                const hasMore = records.length > this.options.limit - 1;
                if (hasMore) {
                    this.menuEl.appendChild(this.searchMore);
                    this.searchMore.classList.remove('d-none');
                } else {
                    this.searchMore.classList.add('d-none');
                }

                if (this.createWidget) {
                    this.menuEl.appendChild(this.createWidget);
                }

                this.waitingForSearch = false;
                this.afterSearch.forEach(cb => cb());
                this.afterSearch = [];

            } catch (error) {
                console.error('Error in _search method:', error);
            }
        },
        _onSearchMoreClick(ev) {
            this._search(this.inputEl.value, true);
        },
    });
    widgetRegistry['we-many2one'] = CustomMany2oneUserValueWidget;
    return CustomMany2oneUserValueWidget;
});
