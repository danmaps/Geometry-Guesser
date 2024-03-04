export class Tool {
    constructor(name, parameters = [], description, map) {
        this.name = name;
        this.parameters = parameters;
        this.description = description;
        this.map = map
    }

    addParameter(parameter) {
        if (parameter instanceof Parameter) {
            this.parameters.push(parameter);
        }
    }

    renderUI() {
        const toolSelection = document.getElementById('toolSelection');
        const toolDetails = document.getElementById('toolDetails');
        const toolContent = document.getElementById('toolContent');
    
        toolSelection.style.display = 'none';
        toolDetails.classList.remove('hidden');
        toolContent.innerHTML = ''; // Clear existing content
    
        this.parameters.forEach(param => {
            const paramLabel = document.createElement('label');
            paramLabel.textContent = `${param.name}: `;
            paramLabel.htmlFor = `param-${param.name}`;
    
            if (param.type === "dropdown") {
                const paramSelect = document.createElement('select');
                paramSelect.id = `param-${param.name}`;
    
                // // Assuming param.options is an array of { value, text } objects for dropdown options
                // param.options.forEach(option => {
                //     const optionElement = document.createElement('option');
                //     optionElement.value = option.value;
                //     optionElement.textContent = option.text;
                //     paramSelect.appendChild(optionElement);
                // });
    
                toolContent.appendChild(paramLabel);
                toolContent.appendChild(paramSelect);
            } else if (param.type === "number") {
                const paramInput = document.createElement('input');
                paramInput.type = "number";
                paramInput.id = `param-${param.name}`;
                paramInput.value = param.defaultValue;
    
                toolContent.appendChild(paramLabel);
                toolContent.appendChild(paramInput);
            }
            // Extend this conditional block to handle other parameter types as needed

            toolContent.appendChild(document.createElement('br')) // add new line between parameters
        });
    
        // Create and append the Execute button after adding all parameters
        const executeButton = document.createElement('button');
        executeButton.textContent = 'Execute';
        executeButton.addEventListener('click', () => this.execute());
        toolContent.appendChild(executeButton);
    }
}