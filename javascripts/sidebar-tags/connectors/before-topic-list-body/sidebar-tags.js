import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

const container = Discourse.__container__;

function alphaId(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

function tagCount(a, b) {
  if (a.count > b.count) {
    return -1;
  }
  if (a.count < b.count) {
    return 1;
  }
  return 0;
}

export default {
  setupComponent(attrs, component) {
    component.set("hideSidebar", false);
    document.querySelector(".topic-list").classList.add("with-sidebar");

    if (!this.site.mobileView) {
      withPluginApi("0.11", (api) => {
        api.onPageChange((url) => {
          let tagRegex = /^\/tag[s]?\/(.*)/;

          if (settings.enable_sidebar) {
            if (this.discoveryList || url.match(tagRegex)) {
              // tag pages aren't discovery lists for some reason?
              // checking for discoveryList makes sure it's not loading on user profiles and other topic lists

              if (this.isDestroyed || this.isDestroying) {
                return;
              }

              component.set("isDiscoveryList", true);
              ajax("/discourse-post-event/events.json").then(function (result) {
                // let events = result.events;
                console.log("events!", result);
                component.set("events", result.events);
              });
            } else {
              component.set("isDiscoveryList", false);
            }
          }
        });
      });
    }
  },
};
