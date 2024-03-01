export class Parameter {
    constructor(name, type, defaultValue, options = null, min = null, max = null) {
        this.name = name;
        this.type = type; // Could be "numer", "dropdown", "slider", "text", etc.
        this.defaultValue = defaultValue;
        this.options = options; // Relevant for dropdowns
        this.min = min; // Relevant for sliders
        this.max = max; // Relevant for sliders
    }
}