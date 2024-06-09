

class InputPositiveNumber extends HTMLElement {
    constructor() {
        super();
        const description = this.getAttribute("description") || "";
        const id = this.getAttribute("inputId") || "";

        this.innerHTML = `
          <label for="${id}">${description}:</label>
          <input id="${id}" type="number" />
          <style>
            .input-positive-number>input::-webkit-outer-spin-button,
            .input-positive-number>input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            input[type=number] {
                -moz-appearance: textfield;
            }
          </style>
        `;

        this.classList.add('input-positive-number');
    }

    #keydownListener;
    #pasteListener;
    connectedCallback() {
        const input = this.querySelector('input');
        input.addEventListener('keydown', this.proibirDigitarNegativo);
        input.addEventListener('paste', this.proibirColarNegativo);
    }

    disconnectedCallback() {
        this.clearListenerr();
    }

    proibirDigitarNegativo(event) {
        if (event.key === '-') {
            event.preventDefault();
        }
    }

    proibirColarNegativo(event) {
        event.preventDefault();
        const valorColado = event.clipboardData.getData('text');
        const valorSemNegativo = valorColado.replace(/-/g, '');
        document.execCommand('insertText', false, valorSemNegativo);
    }

    clearListeners() {
        document.removeEventListener(this.#pasteListener);
        document.removeEventListener(this.#keydownListener);
    }

}

customElements.define("input-positive-number", InputPositiveNumber);