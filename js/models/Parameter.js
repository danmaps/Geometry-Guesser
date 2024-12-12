class Parameter {
    constructor(name, description, type, defaultValue, options = null, min = null, max = null) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.defaultValue = defaultValue;
        this.options = options;
        this.min = min;
        this.max = max;
    }
}

module.exports = { Parameter };