function convert() {

    const textBox = document.getElementById("textBox");
    const fromUnit = document.getElementById("fromUnit");
    const toUnit = document.getElementById("toUnit");
    const result = document.getElementById("result");

    let temp = Number(textBox.value);

    if (isNaN(temp)) {
        result.textContent = "Enter a valid number";
        return;
    }

    if (fromUnit.value === "F") {
        temp = (temp - 32) * 5/9;
    }
    else if (fromUnit.value === "K") {
        temp = temp - 273.15;
    }

    if (toUnit.value === "F") {
        temp = temp * 9/5 + 32;
        result.textContent = temp.toFixed(2) + " °F";
    }
    else if (toUnit.value === "K") {
        temp = temp + 273.15;
        result.textContent = temp.toFixed(2) + " K";
    }
    else {
        result.textContent = temp.toFixed(2) + " °C";
    }
}
