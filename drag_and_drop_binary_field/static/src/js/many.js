/** @odoo-module **/
import { Many2ManyBinaryField } from "@web/views/fields/many2many_binary/many2many_binary_field";
import { onMounted, onWillUnmount } from "@odoo/owl";

export class ExtendedMany2ManyBinaryField extends Many2ManyBinaryField {
    setup() {
        super.setup();
        console.log("ExtendedMany2ManyBinaryField initialized");

        // Bind event handlers to maintain correct context
//        this._handlePaste = this._handlePaste.bind(this);
        this._preventDefaultDragEvents = this._preventDefaultDragEvents.bind(this);

        onMounted(() => {
            this.el = this.__owl__.bdom.parentEl;
            this.pasteArea = document.createElement('div');
            this.pasteArea.className = 'paste-area';
            this.pasteArea.textContent = '';
            this.el.appendChild(this.pasteArea);

            // Add event listeners to the paste area
            this.el.addEventListener("paste", (ev) => this._onPaste(ev));
            this.el.addEventListener("drop", (ev) => this._onDropDown(ev));
            this.el.addEventListener("dragenter", this._disableDefaultDragEvents);
            this.el.addEventListener("dragover", this._disableDefaultDragEvents);
            this.el.addEventListener("dragleave", this._disableDefaultDragEvents);
            this.el.setAttribute('tabindex', '0');
            this.el.focus();
        });

        onWillUnmount(() => {
            const pasteArea = this.el?.querySelector('.o_paste_area');
            if (pasteArea) {
                pasteArea.removeEventListener('paste', this._handlePaste);
            }
        });
    }


_onPaste(event) {
    event.preventDefault();
    console.log("_onPaste", event.clipboardData)
    const clipboardData = event.clipboardData || event.originalEvent.clipboardData;

    // Enhanced file extraction for multiple images
    const imageFiles = [...clipboardData.items]
        .filter(item =>
            // Handle both file kind and image type scenarios
            (item.kind === "file" && item.type.startsWith('image/')) ||
            item.type.startsWith('image/')
        )
        .map(item => item.getAsFile())
        .filter(file => file !== null);

    if (imageFiles.length > 0) {
        console.log(`Detected ${imageFiles.length} image(s) for upload`);

        // Upload multiple files
        imageFiles.forEach(file => {
            console.log('Pasting file:', file.name);
            this.uploadData(file);
        });
    } else {
        console.warn('No valid image files found in clipboard.');
    }
}

    uploadData(file) {
        const customFileList = new DataTransfer();
        customFileList.items.add(file);
        const input = this.el.querySelector('.o_input_file');

        if (input) {
            input.files = customFileList.files;
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);

        } else {
            console.error('Input element not found for file upload.');
        }
    }

    // Handle paste event for image files
//    _handlePaste(event) {
//        event.preventDefault();
//        const clipboardData = event.clipboardData || window.clipboardData;
//
//        // Filter and extract image files
//        const imageFiles = [...clipboardData.items]
//            .filter(item => item.type.startsWith('image/'))
//            .map(item => item.getAsFile())
//            .filter(file => file !== null);
//
//        // Upload each image file
//        imageFiles.forEach(file => this._uploadFiles([file]));
//    }

    // Handle drop event for file uploads
    _onDropDown(ev) {
        ev.preventDefault();
        console.log('_onDropDown',ev.dataTransfer)
        const files = ev.dataTransfer.items ?
            [...ev.dataTransfer.items].map(item => item.kind === "file" ? item.getAsFile() : null).filter(f => f !== null) :
            [...ev.dataTransfer.files];

        if (files.length > 0) {
            files.forEach(file => {
                console.log('Dropped file:', file.name);
                this.uploadData(file);
            });
        } else {
            console.warn('No files dropped.');
        }
    }

    // Upload files through existing mechanism
    _uploadFiles(files) {
        try {
            const fileInput = this.el?.querySelector('.o_file_input');

            if (fileInput) {
                const dataTransfer = new DataTransfer();
                files.forEach(file => dataTransfer.items.add(file));

                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } catch (error) {
            console.error('File upload error:', error);
            this.notification.add(
                this.env._t('Error uploading files'),
                { type: 'danger' }
            );
        }
    }

    // Prevent default drag events
    _preventDefaultDragEvents(event) {
        event.preventDefault();
    }

    // Log additional details about uploaded files
    async onFileUploaded(files) {
        console.log("Files uploaded:", files);
        await super.onFileUploaded(files);
    }

// Robust method to get file extension
    getExtension(file) {
        // Check if it's an Odoo record object
        if (file && file.data && file.data.name) {
            return file.data.name.split('.').pop();
        }

        // Check if it's a standard File object
        if (file && file.name) {
            return file.name.split('.').pop();
        }

        // Fallback for unexpected input
        return '';
    }
}

import { registry } from "@web/core/registry";

registry
    .category("fields")
    .add("many2many_binary_extended", {
        component: ExtendedMany2ManyBinaryField,
        ...Many2ManyBinaryField,
    });