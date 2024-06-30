// Selecting DOM elements
const passwordOutput = document.querySelector(".password-display");
const passwordPlaceholder = document.querySelector(".password-placeholder");
const copyButton = document.querySelector(".copy-button");
const copyStatus = document.querySelector(".copy-status");

const settingsForm = document.querySelector(".settings-form");
const lengthSlider = document.querySelector(".length-slider");
const lengthDisplay = document.querySelector(".length-count");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");

const strengthText = document.querySelector(".strength-text");
const strengthBars = document.querySelectorAll(".bar");

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "1234567890",
  symbols: "!@#$%^&*()",
};

let isCopyEnabled = false;

// Update slider value display
const updateSliderValue = () =>
  (lengthDisplay.textContent = lengthSlider.value);

// Style the range slider
const styleSlider = () => {
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  const value = lengthSlider.value;

  lengthSlider.style.backgroundSize = `${
    ((value - min) * 100) / (max - min)
  }% 100%`;
};

// Handle slider input event
const onSliderInput = () => {
  updateSliderValue();
  styleSlider();
};

// Reset strength meter bar styles
const resetStrengthMeter = () =>
  strengthBars.forEach((bar) => {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });

// Apply styles to strength meter bars
const applyBarStyles = (bars, color) =>
  bars.forEach((bar) => {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });

// Style the strength meter
const updateStrengthMeter = (rating) => {
  const [text, numBars] = rating;
  const barsToStyle = Array.from(strengthBars).slice(0, numBars);

  resetStrengthMeter();
  strengthText.textContent = text;

  const colors = [
    "hsl(0, 91%, 63%)",
    "hsl(13, 95%, 66%)",
    "hsl(42, 91%, 68%)",
    "hsl(127, 100%, 82%)",
  ];

  applyBarStyles(barsToStyle, colors[numBars - 1]);
};

// Calculate password strength
const calculateStrength = (length, poolSize) => {
  const entropy = length * Math.log2(poolSize);

  if (entropy < 25) return ["Too Weak!", 1];
  if (entropy < 50) return ["Weak", 2];
  if (entropy < 75) return ["Medium", 3];
  return ["Strong", 4];
};

// Generate a random password
const generatePassword = (e) => {
  e.preventDefault();

  try {
    validateInput();

    let password = "";
    const includedSets = [];
    let charPoolSize = 0;

    checkBoxes.forEach(({ checked, value }) => {
      if (checked) {
        includedSets.push(CHAR_SETS[value]);
        charPoolSize += CHAR_SETS[value].length;
      }
    });

    if (includedSets.length > 0) {
      for (let i = 0; i < lengthSlider.value; i++) {
        const randomSet =
          includedSets[Math.floor(Math.random() * includedSets.length)];
        password += randomSet[Math.floor(Math.random() * randomSet.length)];
      }
    }

    const strength = calculateStrength(lengthSlider.value, charPoolSize);
    updateStrengthMeter(strength);

    passwordOutput.textContent = password;
    isCopyEnabled = true;
  } catch (error) {
    console.error(error);
  }
};

// Validate user input
const validateInput = () => {
  if (Array.from(checkBoxes).every(({ checked }) => !checked)) {
    throw new Error("Make sure to check at least one box");
  }
};

// Copy password to clipboard
const copyToClipboard = async () => {
  if (!passwordOutput.textContent || copyStatus.textContent || !isCopyEnabled)
    return;

  await navigator.clipboard.writeText(passwordOutput.textContent);
  copyStatus.textContent = "Copied";

  setTimeout(() => {
    copyStatus.style.transition = "all 1s";
    copyStatus.style.opacity = 0;

    setTimeout(() => {
      copyStatus.style.removeProperty("opacity");
      copyStatus.style.removeProperty("transition");
      copyStatus.textContent = "";
    }, 1000);
  }, 1000);
};

// Initialize the number of characters on page load
lengthDisplay.textContent = lengthSlider.value;

// Event listeners
copyButton.addEventListener("click", copyToClipboard);
lengthSlider.addEventListener("input", onSliderInput);
settingsForm.addEventListener("submit", generatePassword);
