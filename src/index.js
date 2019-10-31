import SimpleBar from "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.

class CognusCard extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", e => {
      if (this.href) {
        window.location.href = this.href;
      }
      if (this.action) {
        this[action]();
      }
    });
  }

  static get observedAttributes() {
    return ["name", "category", "action", "href"];
  }
  //
  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this._updateRendering();
  }
  connectedCallback() {
    const template = `
    <div
      class="w-full md:mx-1 bg-white rounded-lg p-6 cursor-pointer shadow-md"
    >
      <div class="relative">
        <div class="text-gray-700 ellipsis">${this.category}</div>
        <h2 class="text-lg font-semibold">${this.name}</h2>
        <div
          class="p-0 items-center text-indigo-600 leading-none lg:rounded-full flex lg:inline-flex "
          role="alert"
        >
          <span class="flex rounded-full py-1 mr-3">${this.action}</span>
          <svg
            class="fill-current opacity-75 h-4 w-4 mb-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    `;

    this.innerHTML = template;
  }

  get href() {
    return this.getAttribute("href");
  }

  set href(v) {
    this.setAttribute("href", v);
  }

  get action() {
    return this.getAttribute("action") || "Run";
  }

  set action(v) {
    this.setAttribute("action", v);
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(v) {
    this.setAttribute("name", v);
  }

  get category() {
    return this.getAttribute("category");
  }

  set category(v) {
    this.setAttribute("category", v);
  }

  _updateRendering() {
    //console.log("Update rendering");
  }
}

class CognusDescription extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["title", "description"];
  }
  //
  attributeChangedCallback(name, oldValue, newValue) {
    this[`_${name}`] = newValue;
    this._updateRendering();
  }
  connectedCallback() {
    let title = "";
    if (this.title) {
      title = `<div class="font-bold text-xl mb-3">${this.title}</div>`;
    }
    const template = `
      ${title}
      <p class="text-gray-700 text-base ">${this.description}</p> `;

    this.innerHTML = template;
  }

  get title() {
    return this.getAttribute("title");
  }

  set title(v) {
    this.setAttribute("title", v);
  }

  get description() {
    return this.getAttribute("description");
  }

  set description(v) {
    this.setAttribute("description", v);
  }

  _updateRendering() {
    //.log("Update rendering");
  }
}

class CognusHr extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const template = `
      <hr class="border-gray-400" />
    `;

    this.innerHTML = template;
  }
}

class CognusLi extends HTMLElement {
  constructor() {
    super();
  }
  get text() {
    return this.getAttribute("text");
  }
  set text(v) {
    return this.setAttribute("text", v);
  }
  connectedCallback() {
    const template = `
      <li class="text-gray-700 flex mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 float-left mr-2 mt-1" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z" fill="#5a67d8"/></svg>
        <img
          src="https://cdn.jsdelivr.net/gh/pihh/cognus-project-tester-web-components/icons/checkmark-solid.svg"
          class="h-5 float-left mr-2 mt-1"
        >${this.text}</li>
    `;

    this.innerHTML = template;
  }
}

class CognusRepeat extends HTMLElement {
  constructor() {
    super();
  }
  createdCallback() {
    if (this.getAttribute("shadow")) {
      this.attachShadow({ mode: "open" });
    } else {
      if (!this.template) this.template = this.innerHTML;
      this.render();
    }
  }
  attachedCallback() {
    this.render();
  }
  render() {
    if (!this.template) this.template = this.innerHTML;

    const content = CognusRepeat.fromJson(this.getAttribute("content"));
    const element = this.getAttribute("element");
    const template = this.template;

    let html = element !== null ? "<" + element.toLowerCase() + ">" : "";

    if (Array.isArray(content)) {
      content.forEach(function(item) {
        html += CognusRepeat.interpolate(template, item);
      });
    } else {
      throw new Error("Content should be an Array of objects.");
    }
    html += element !== null ? "</" + element.toLowerCase() + ">" : "";
    if (this.getAttribute("shadow")) {
      this.shadowRoot.innerHTML = html;
      this.innerHTML = "";
    } else {
      this.innerHTML = html;
    }
  }
  attributeChangedCallback(name) {
    console.log({ name });
    switch (name) {
      case "content":
        this.render();
        break;
    }
  }
  static interpolate(template, obj) {
    if (typeof obj == "object") {
      for (var key in obj) {
        const find = "${" + key + "}";
        if (template.indexOf(find) > -1) {
          template = template.replace(find, obj[key]);
          delete obj[key];
        }
      }
    }
    return template;
  }
  static fromJson(str) {
    let obj = null;
    if (typeof str == "string") {
      try {
        obj = JSON.parse(str);
      } catch (e) {
        throw new Error("Invalid JSON string provided. ");
      }
    }
    return obj;
  }
}

customElements.define("cognus-li", CognusLi);
customElements.define("cognus-hr", CognusHr);
customElements.define("cognus-description", CognusDescription);
customElements.define("cognus-card", CognusCard);
// customElements.define("cognus-repeat", CognusRepeat);

document.registerElement("cognus-repeat", CognusRepeat);

window.onload = function() {
  function setSimplebar() {
    new SimpleBar(document.getElementById("container"));
  }
  setTimeout(() => {
    setSimplebar();
  }, 10);
};
