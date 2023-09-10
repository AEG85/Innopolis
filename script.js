function convertTemperature(value, unit) {
    let result = 0
    if (unit === "Fahrenheit") {
        result = parseFloat((value - 32) * 5 / 9);
    } else if (unit === "Celsius") {
        result = parseFloat(value * 9 / 5 + 32);
    }
    if (isNaN(result)) {
        return 'Укажите корректное число!'
    } else {
        return result
    }
}

document.getElementById("temperature-input").addEventListener("change", function () {
    const temperature = parseFloat(this.value)
    const unit = document.getElementById("unit-select").value
    const convertedTemperature = convertTemperature(temperature, unit)
    document.getElementById("result").textContent = convertedTemperature
})

document.getElementById("unit-select").addEventListener("change", function () {
    const unit = this.value
    const temperature = parseFloat(document.getElementById("temperature-input").value)
    const convertedTemperature = convertTemperature(temperature, unit)
    document.getElementById("result").textContent = convertedTemperature
})
