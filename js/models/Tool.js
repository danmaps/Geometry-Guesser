class Tool {
    constructor(name, parameters = []) {
        this.name = name;
        this.parameters = parameters; // An array of Parameter instances
    }

    // Method to add a parameter to the tool
    addParameter(parameter) {
        if (parameter instanceof Parameter) {
            this.parameters.push(parameter);
        }
    }

    // Method to render the tool's UI, including all parameters
    renderUI() {
        let uiHTML = `<h2>${this.name}</h2>`;
        this.parameters.forEach(param => {
            uiHTML += param.render();
        });
        return uiHTML;
    }

    // Method to execute the tool's functionality
    // Placeholder for now, could be overridden in subclasses or implemented here
    execute() {
        // Implementation of what happens when the tool is executed
    }
}