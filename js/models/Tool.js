export class Tool {
    constructor(name, parameters = [], description, map) {
        this.name = name;
        this.parameters = parameters;
        this.description = description;
        this.map = map;

        // Wrap the execute method in the constructor
        this.execute = this.reRenderOnExecute(this.execute.bind(this));
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

            let paramInput;

            if (param.type === "dropdown") {
                paramInput = document.createElement('select');
                paramInput.id = `param-${param.name}`;
            } else if (param.type === "int" || param.type === "float") {
                paramInput = document.createElement('input');
                paramInput.type = "number";
                paramInput.id = `param-${param.name}`;
                paramInput.value = param.defaultValue;
                paramInput.step = param.type === "int" ? "1" : "any";
            } else if (param.type === "boolean") {
                paramInput = document.createElement('input');
                paramInput.type = "checkbox";
                paramInput.id = `param-${param.name}`;
                paramInput.value = param.defaultValue;
            } else if (param.type === "text") {
                paramInput = document.createElement('input');
                paramInput.type = "text";
                paramInput.id = `param-${param.name}`;
                paramInput.value = param.defaultValue;
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

    execute() {
        // console.log("Executing tool: " + this.name);
    }

    reRenderOnExecute(exec) {
        return () => {
            const toolContent = document.getElementById('toolContent');
            
            // Start loading animation (pulsing background of toolContent div)
            toolContent.classList.add('pulsate');
            
            // Wait a bit before executing, so the loading animation is visible
            setTimeout(() => {
                console.log("Executing " + this.name);
                
                // Execute the provided function
                exec();
                
                // Stop loading animation
                toolContent.classList.remove('pulsate');
                
                // Re-render the UI
                this.renderUI();
            }, 0);
        };
    }
    
}
