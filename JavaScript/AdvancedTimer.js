function updateCountdown() {
    const startDateInput = document.getElementById("startDateTime").value;
    const targetDateInput = document.getElementById("targetDateTime").value;
    const startNumber = parseFloat(document.getElementById("startNumber").value);
    const endNumber = parseFloat(document.getElementById("endNumber").value);
    const startDate = new Date(startDateInput);
    const targetDate = new Date(targetDateInput);
    const now = new Date();

    if (now < startDate) {
        document.getElementById("countdown").innerHTML = "Countdown will start soon!";
    } else if (now >= startDate && now <= targetDate) {
        const timeDiff = targetDate - startDate;
        const timeElapsed = now - startDate;
        const progress = timeElapsed / timeDiff;
        const currentNumber = startNumber - (progress * (startNumber - endNumber));
        document.getElementById("countdown").innerHTML = "Current Number: " + currentNumber.toFixed(2);
    } else {
        document.getElementById("countdown").innerHTML = "Countdown has ended!";
    }
}

setInterval(updateCountdown, 1);
updateCountdown();

setInterval(generateTimeSlices, 1);
generateTimeSlices();

document.addEventListener("DOMContentLoaded", function() {
    const now = new Date();
    const currentMinute = now.getMinutes();

    const endMinute = (currentMinute + 1) % 60;
    const oneMinuteLater = new Date(now);
    oneMinuteLater.setMinutes(endMinute);

    const timezoneOffset = now.getTimezoneOffset();
    const currentDateTime = new Date(now.getTime() - (timezoneOffset * 60 * 1000)).toISOString().slice(0, 16);
    const oneMinuteLaterDateTime = new Date(oneMinuteLater.getTime() - (timezoneOffset * 60 * 1000)).toISOString().slice(0, 16);

    document.getElementById("startDateTime").value = currentDateTime;
    document.getElementById("targetDateTime").value = oneMinuteLaterDateTime;
    document.getElementById("startNumber").value = 0;
    document.getElementById("endNumber").value = 100;
});

const startDateTimeInput = document.getElementById("startDateTime");
const targetDateTimeInput = document.getElementById("targetDateTime");
const startNumberInput = document.getElementById("startNumber");
const endNumberInput = document.getElementById("endNumber");
const timePerSliceInput = document.getElementById("timePerSlice");
const timeUnitSelect = document.getElementById("timeUnit");

function generateTimeSlices() {
    const startDateInput = document.getElementById("startDateTime").value;
    const targetDateInput = document.getElementById("targetDateTime").value;
    const startNumber = parseFloat(document.getElementById("startNumber").value);
    const endNumber = parseFloat(document.getElementById("endNumber").value);
    const timePerSlice = parseFloat(document.getElementById("timePerSlice").value);
    const timeUnit = document.getElementById("timeUnit").value;
    const sliceHighlighter = parseFloat(document.getElementById("sliceHighlighter").value);
    const startDate = new Date(startDateInput);
    const targetDate = new Date(targetDateInput);

    if (isNaN(timePerSlice) || timePerSlice <= 0) {
        document.getElementById("timeSlices").innerHTML = "";
        return;
    }

    const currentTime = new Date();
    const timeSlicesContainer = document.getElementById("timeSlices");
    timeSlicesContainer.innerHTML = "";

    let timeForNextSlice = startDate;
    let sliceCounter = 0;
    let lastHighlightedSlice = null;

    while (timeForNextSlice < targetDate) {
        sliceCounter++;

        if (sliceCounter > 250) {
            timeSlicesContainer.innerHTML = "Too many slices! Please adjust your input.";
            sliceCounter = 0;
            break;
        }

        const sliceEntry = document.createElement("p");
        const currentSliceNumber = calculateCurrentNumber(timeForNextSlice, startDate, targetDate, startNumber, endNumber);

        sliceEntry.textContent = `${timeForNextSlice.toDateString()} ${timeForNextSlice.toLocaleTimeString()}\t${currentSliceNumber.toFixed(2)}`;

        if (!isNaN(sliceHighlighter) && currentSliceNumber <= sliceHighlighter) {
            lastHighlightedSlice = sliceEntry;
        }

        if (timeForNextSlice <= currentTime && currentTime < getNextSliceTime(timeForNextSlice, timePerSlice, timeUnit)) {
            sliceEntry.style.color = "lime";
        }

        timeSlicesContainer.appendChild(sliceEntry);

        timeForNextSlice = getNextSliceTime(timeForNextSlice, timePerSlice, timeUnit);
    }

    if (lastHighlightedSlice) {
        lastHighlightedSlice.style.color = "yellow";
    }
}

function getNextSliceTime(currentTime, timePerSlice, timeUnit) {
    switch (timeUnit) {
        case "days":
            return new Date(currentTime.getTime() + (timePerSlice * 24 * 60 * 60 * 1000));
        case "hours":
            return new Date(currentTime.getTime() + (timePerSlice * 60 * 60 * 1000));
        case "minutes":
            return new Date(currentTime.getTime() + (timePerSlice * 60 * 1000));
        case "seconds":
            return new Date(currentTime.getTime() + (timePerSlice * 1000));
        default:
            return currentTime;
    }
}

function calculateCurrentNumber(timeForSlice, startDate, targetDate, startNumber, endNumber) {
    const timeElapsed = (timeForSlice - startDate) / 1000;
    return startNumber - (timeElapsed * ((startNumber - endNumber) / ((targetDate - startDate) / 1000))).toFixed(2);
}

function getNextSliceTime(currentTime, timePerSlice, timeUnit) {
    switch (timeUnit) {
        case "days":
            return new Date(currentTime.getTime() + (timePerSlice * 24 * 60 * 60 * 1000));
        case "hours":
            return new Date(currentTime.getTime() + (timePerSlice * 60 * 60 * 1000));
        case "minutes":
            return new Date(currentTime.getTime() + (timePerSlice * 60 * 1000));
        case "seconds":
            return new Date(currentTime.getTime() + (timePerSlice * 1000));
        default:
            return currentTime;
    }
}


function savePreset() {
    const presets = getPresetsFromLocalStorage() || [];
    const presetName = prompt("Enter a name for the preset:");
    if (presetName) {
        const preset = {
            name: presetName,
            startDateTime: document.getElementById("startDateTime").value,
            targetDateTime: document.getElementById("targetDateTime").value,
            startNumber: document.getElementById("startNumber").value,
            endNumber: document.getElementById("endNumber").value,
            timePerSlice: document.getElementById("timePerSlice").value,
            timeUnit: document.getElementById("timeUnit").value,
        };
        presets.push(preset);
        localStorage.setItem("presets", JSON.stringify(presets));
        
        const presetDropdown = document.getElementById("presetDropdown");
        const option = document.createElement("option");
        option.value = preset.name;
        option.textContent = preset.name;
        presetDropdown.appendChild(option);
    }
}


function loadPreset(presetName) {
    const presets = getPresetsFromLocalStorage() || [];
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
        document.getElementById("startDateTime").value = preset.startDateTime;
        document.getElementById("targetDateTime").value = preset.targetDateTime;
        document.getElementById("startNumber").value = preset.startNumber;
        document.getElementById("endNumber").value = preset.endNumber;
        document.getElementById("timePerSlice").value = preset.timePerSlice;
        document.getElementById("timeUnit").value = preset.timeUnit;
        generateTimeSlices();
    }
}

function deletePreset(presetName) {
    const presets = getPresetsFromLocalStorage() || [];
    const updatedPresets = presets.filter((p) => p.name !== presetName);
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
}

function getPresetsFromLocalStorage() {
    const presetsJson = localStorage.getItem("presets");
    return presetsJson ? JSON.parse(presetsJson) : [];
}

document.addEventListener("DOMContentLoaded", function () {
    const presets = getPresetsFromLocalStorage();
    const presetDropdown = document.getElementById("presetDropdown");
    presets.forEach((preset) => {
        const option = document.createElement("option");
        option.value = preset.name;
        option.textContent = preset.name;
        presetDropdown.appendChild(option);
    });
});

const presetDropdown = document.getElementById("presetDropdown");
presetDropdown.addEventListener("change", function () {
    const selectedPreset = presetDropdown.value;
    if (selectedPreset) {
        loadPreset(selectedPreset);
    }
});

const deletePresetButton = document.getElementById("deletePresetButton");
deletePresetButton.addEventListener("click", function () {
    const selectedPreset = presetDropdown.value;
    if (selectedPreset) {
        deletePreset(selectedPreset);
        presetDropdown.remove(presetDropdown.selectedIndex);
        document.getElementById("startDateTime").value = "";
        document.getElementById("targetDateTime").value = "";
        document.getElementById("startNumber").value = "";
        document.getElementById("endNumber").value = "";
        document.getElementById("timePerSlice").value = "";
        document.getElementById("timeUnit").value = "seconds";
        generateTimeSlices();
    }
});