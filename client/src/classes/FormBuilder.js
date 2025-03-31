export default class FormBuilder {
    static formItem(name, defaultValue, options) {
        const safeName = name.replaceAll(' ', '-');
        const labelName = options ? options.labelName : name;

        return FormBuilder.div(
            'form-item', [
                FormBuilder.label(labelName, safeName),
                FormBuilder.textInput(name, defaultValue)
            ]);
    }
    
    static label(name, htmlFor) {
        const safeName = name.replaceAll(' ', '-');
        
        const label = document.createElement('label');
        label.textContent = name + ':';
        label.id = safeName + '-label';
        label.for = htmlFor;
        label.className = 'input-label';
        
        return label;
    }
    
    static textInput(name, defaultValue) {
        const safeName = name.replaceAll(' ', '-');
        
        const input = document.createElement('input')
        input.className = 'text-input';
        input.id = safeName;
        input.name = safeName;
        input.value = defaultValue;
        
        return input;
    }
    
    static radio(name, value, checked) {
        const safeName = name.replaceAll(' ', '-');
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = safeName;
        radio.id = safeName + '-label';
        radio.className = 'radial-button';
        radio.checked = checked;
        radio.value = value;
        
        return radio;
    }
    
    static button(text, className, onClick) {
        const eraseButton = document.createElement('button');
        eraseButton.className = className;
        eraseButton.textContent = text;
        eraseButton.onclick = onClick;
        
        return eraseButton;
    }

    static div(className, children) {
        const div = document.createElement('div');
        div.className = className;
        children.forEach(child => div.appendChild(child));

        return div;
    }
}