export class Tool {
    constructor(name, parameters = []) {
        this.name = name;
        this.parameters = parameters;
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

        // Hide the tool selection and show the tool details
        toolSelection.style.display = 'none';
        toolDetails.classList.remove('hidden');
        toolContent.innerHTML = ''; // Clear existing content

        // Show the tool name
        const nameDiv = document.createElement('h3');
        nameDiv.textContent = this.name;
        toolContent.appendChild(nameDiv);

        // Dynamically create and append elements for each parameter
        this.parameters.forEach(param => {
            const paramDiv = document.createElement('div');
            paramDiv.textContent = `${param.name}:`;
            const input = document.createElement('input');
            input.id = `param-${param.name}`; // Unique ID based on parameter name
            input.setAttribute('type', param.type === 'number' ? 'number' : 'text'); // Adjust type accordingly
            paramDiv.appendChild(input);
            toolContent.appendChild(paramDiv);
        });

        // Create the Execute button
        const executeButton = document.createElement('button');
        executeButton.textContent = 'Run';
        toolContent.appendChild(executeButton);
    
        // Attach an event listener to the Execute button
        executeButton.addEventListener('click', () => this.execute());
    }    


}