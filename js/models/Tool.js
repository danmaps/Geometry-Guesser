export class Tool {
    constructor(name, parameters = [], description, map) {
        this.name = name;
        this.parameters = parameters;
        this.description = description;
        this.map = map;
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
    
            let paramInput; // Declare variable here so it's accessible in the entire block
    
            if (param.type === "dropdown") {
                paramInput = document.createElement('select');
                paramInput.id = `param-${param.name}`;
            } else if (param.type === "int" || param.type === "float") {
                paramInput = document.createElement('input');
                paramInput.type = "number";
                paramInput.id = `param-${param.name}`;
                paramInput.value = param.defaultValue;
                paramInput.step = param.type === "int" ? "1" : "any";
            }
            
            // Common setup for all paramInput elements, including event listener for Enter key
            if (paramInput) {
                toolContent.appendChild(paramLabel);
                toolContent.appendChild(paramInput);
                toolContent.appendChild(document.createElement('br')); // Add new line between parameters

                // Event listener for Enter key to trigger button click
                paramInput.addEventListener('keydown', function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault(); // Prevent the default action (form submission)
                        executeButton.click(); // Trigger the click event on the execute button
                    }
                });
            }
        });
    
        // Create and append the Execute button after adding all parameters
        const executeButton = document.createElement('button');
        executeButton.textContent = 'Execute';
        executeButton.addEventListener('click', () => this.execute());
        toolContent.appendChild(executeButton);
    }
}
