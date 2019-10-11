class CognusCard extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["name", "category"];
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
          class="p-0 items-center text-indigo-600 leading-none lg:rounded-full flex lg:inline-flex run-action"
          role="alert"
        >
          <span class="flex rounded-full py-1 mr-3">Run</span>
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

customElements.define("cognus-hr", CognusHr);
customElements.define("cognus-description", CognusDescription);
customElements.define("cognus-card", CognusCard);
