export class Tool {
    constructor(name, parameters = [], description, map) {
        this.name = name;
        this.parameters = parameters;
        this.description = description;
        this.map = map;

        // Wrap the execute method in the constructor
        this.execute = this.reRenderOnExecute(this.execute.bind(this));

        // Messages to store status info
        this.statusMessage = `${name} Success`;
        this.statusCode = 0;

        //SUCCESS = 0;
        //GENERAL_ERROR = 1;
        //INVALID_INPUT = 2;
        //EXECUTION_FAILED = 3;
        //RESOURCE_NOT_FOUND = 4;
        //PERMISSION_DENIED = 5;
        //TIMEOUT = 6;
        //EXTERNAL_DEPENDENCY_ERROR = 7; 
    }

    // Method to set status and message
    setStatus(code, message) {
        this.statusCode = code;
        this.statusMessage = message;
    }

    // Method to get the current status
    getStatus() {
        return {
            code: this.statusCode,
            message: this.statusMessage
        };
    }

    renderUI() {
        console.log(`Rendering UI for ${this.constructor.name}`);
        const toolSelection = document.getElementById('toolSelection');
        const toolDetails = document.getElementById('toolDetails');
        const toolContent = document.getElementById('toolContent');

        toolSelection.style.display = 'none';
        toolDetails.classList.remove('hidden');
        toolContent.innerHTML = ''; // Clear existing content

        const toolName = document.createElement('h2');
        // add tool name to toolContent as attribute "tool"
        toolName.textContent = this.name;
        toolContent.appendChild(toolName);

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
        try {
            // console.log("Executing " + this.name);
            // Set status to success
            this.setStatus(0, "Execution successful");
        } catch (error) {
            console.error("Error during execution:", error);
            // Set status to indicate failure
            this.setStatus(1, "Execution failed");
        }
    }

    reRenderOnExecute(exec) {
        return () => {
            const toolContent = document.getElementById('toolContent');
            
            // Start loading animation (pulsing background of toolContent div)
            toolContent.classList.add('pulsate');
            
            // Wait a bit before executing, so the loading animation is visible
            setTimeout(() => {
                try {
                    // Execute function
                    exec();
                } catch (error) {
                    // Set error status
                    this.setStatus(1, 'Execution failed');
                } finally {
                    // Stop loading animation
                    toolContent.classList.remove('pulsate');
                    
                    // log the status
                    const status = this.getStatus();
                    const logStatus = status.code !== 0 ? console.warn : console.log;
                    logStatus("Status:", status.code, status.message);

                    // Update the status message in the UI
                    document.getElementById('statusMessage').style.display = 'block';

                    // remove whatever alert-* class is currently applied
                    const oldStatusMessage = document.getElementById('statusMessageText');
                    oldStatusMessage.classList.remove('alert-success', 'alert-danger');

                    // if status.code is 0, make the status message a success message
                    const alertType = status.code === 0 ? 'success' : 'danger';
                    document.getElementById('statusMessageText').classList.add(`alert-${alertType}`);

                    const statusMessage = document.getElementById('statusMessageText');
                    statusMessage.textContent = status.message;
                    
                    // Re-render the UI
                    this.renderUI();
                }
            }, 0); // Wait ms before executing
        };
    }
}
