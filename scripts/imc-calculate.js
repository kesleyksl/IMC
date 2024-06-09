class IMCCalculator extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
        <div class="container">
          <h1>Calculadora de IMC</h1>
          <form id="imcForm">
            <input-positive-number description="Peso (kg)" inputId="weight"></input-positive-number>
            <input-positive-number description="Altura (cm)" inputId="height"></input-positive-number>
            <button type="submit">Calcular IMC</button>
          </form>
          <div id="result" class="result"></div>
        </div>
        <style>
          .container {
            width: 300px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }
          h1 {
            text-align: center;
          }
          form {
            display: flex;
            flex-direction: column;
          }
          input-positive-number {
            margin-bottom: 15px;
          }
          input-positive-number label {
            display: block;
            margin-bottom: 5px;
          }
          input-positive-number input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
          }
          button {
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #0056b3;
          }
          .result {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      `;
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }

    #heightInput;
    #weightInput;
    #resultDiv;
    #formListener;
    #heightInputListener;
    #weightInputListener;

    connectedCallback() {
        const formulario = this.shadowRoot.querySelector('#imcForm');
        this.#heightInput = this.shadowRoot.querySelector('#height');
        this.#weightInput = this.shadowRoot.querySelector('#weight');
        this.#resultDiv = this.shadowRoot.querySelector('#result');
        this.#weightInputListener = this.#weightInput.addEventListener('input', this.clearResultDiv.bind(this));
        this.#heightInputListener = this.#heightInput.addEventListener('input', this.clearResultDiv.bind(this));
        this.#formListener = formulario.addEventListener('submit', (event) => {
            event.preventDefault();
            try {
                const imc = this.ImcCalculate();
                const classification = this.ImcClassification(imc);
                const resultMessage = `Seu IMC é de ${imc.toFixed(1)}kg/m². Este valor é considerado como ${classification}!`;
                this.#resultDiv.textContent = resultMessage;
            } catch (e) {
                this.#resultDiv.textContent = e;
            }
        });
    }

    disconnectedCallback() {
        this.clearListeners();
    }

    ImcClassification(imc) {
        if (isNaN(imc)) {
            throw 'Verifique os valores digitados e certifique-se que eles são numéricos e positivos';
        }
        let classification = '';
        if (imc < 18.5) {
            classification = 'Magreza';
        } else if (imc < 24.9) {
            classification = 'Normal';
        } else if (imc < 30) {
            classification = 'Sobrepeso';
        } else {
            classification = 'Obesidade';
        }
        return classification;
    }

    ImcCalculate() {
        const altura = this.#heightInput.value / 100;
        const peso = this.#weightInput.value;
        if (altura <= 0 || peso < 0) {
            return NaN;
        }
        const imc = peso / (altura * altura);
        return imc;
    }

    clearResultDiv() {
        this.#resultDiv.textContent = '';
    }

    clearListeners() {
        document.removeEventListener(this.#formListener);
        document.removeEventListener(this.#heightInputListener);
        document.removeEventListener(this.#weightInputListener);
    }
}

customElements.define('imc-calculator', IMCCalculator);
