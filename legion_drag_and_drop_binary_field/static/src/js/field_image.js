/** @odoo-module **/
import {registry} from "@web/core/registry";
import {ImageField, imageField} from "@web/views/fields/image/image_field";
import {onMounted} from "@odoo/owl";


export class FieldImageDragAndDrop extends ImageField {
    setup() {
        super.setup();
        onMounted(() => {
            // Ensure `this.el` is set up correctly
            this.el = this.__owl__.bdom.parentEl;
            this.el.setAttribute('tabindex', '0');
            this.el.focus();

            // Add event listeners
            this.el.addEventListener("drop", (ev) => this._onDropDown(ev));
            this.el.addEventListener("paste", (ev) => this._onPaste(ev));
            this.el.addEventListener("dragenter", this._disableDefaultDragEvents);
            this.el.addEventListener("dragover", this._disableDefaultDragEvents);
            this.el.addEventListener("dragleave", this._disableDefaultDragEvents);

        });
    }

    _onPaste(event) {
        // Handles the 'paste' event within the component, preventing the default action
        // and extracting image data for upload.
        event.preventDefault();
        const clipboardData = event.clipboardData || event.originalEvent.clipboardData;
        const imageItem = [...clipboardData.items].find((item) =>
            item.type.includes("image/")
        );

        if (imageItem) {
            const file = imageItem.getAsFile();
            this.uploadData(file);
        }
    }

    _onDropDown(ev) {
        ev.preventDefault()
        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach((item, i) => {
                if (item.kind === "file") {
                    const file = item.getAsFile()
                    this.uploadData(file)
                }
            })
        } else {
            [...ev.dataTransfer.files].forEach((file, i) => {
                this.uploadData(file)
            })
        }
    }

    uploadData(file) {
        debugger;
        const customFileList = new DataTransfer();
        customFileList.items.add(file);
        const input = this.el.querySelector('.o_input_file');
        if (input) {
            input.files = customFileList.files;
            const event = new Event('change');
            input.dispatchEvent(event);
        }

    }

    _disableDefaultDragEvents(e) {
        e.preventDefault();
    }
}

export const fieldImageDragAndDrop = {
    ...imageField,
    component: FieldImageDragAndDrop,
};

registry.category('fields').add("drag_drop_and_paste_image", fieldImageDragAndDrop);
