export class Parameter {
    constructor(name, description, type, defaultValue, options = null, min = null, max = null) {
        this.name = name;
        this.description = description;
        this.type = type; // Could be "numer", "dropdown", "slider", "text", "boolean", etc.
        this.defaultValue = defaultValue;
        this.options = options; // Relevant for dropdowns
        this.min = min; // Relevant for sliders
        this.max = max; // Relevant for sliders
    }
}