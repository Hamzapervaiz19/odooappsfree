/* @odoo-module */

import { registry } from "@web/core/registry";
import { WebClient } from "@web/webclient/webclient";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";

patch(WebClient.prototype, {
    setup() {
        super.setup();
        // Set custom window title
        const titleService = useService("title");
        titleService.setParts({ zopenerp: "" });

        // Replace favicon
        const iconUrl = "/legionsoft_hide_powerd_by_odoo/static/icons/faviconV2.png";
        const link = document.querySelector("link[rel~='icon']");

        if (link) {
            link.href = iconUrl;
        } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = iconUrl;
            document.head.appendChild(newLink);
        }
    },
});
