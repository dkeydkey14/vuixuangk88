// Countdown Timer
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    let time = countdownElement.textContent.split(':');
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    let seconds = parseInt(time[2]);

    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                hours = 23;
            }
        }
    }

    countdownElement.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

setInterval(updateCountdown, 1000);

// Number Input Handling
const numberInputs = document.querySelectorAll('.number-input');
const numberCircles = document.querySelectorAll('.number-circle');

numberInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;

        if (value && index < numberInputs.length - 1) {
            numberInputs[index + 1].focus();
        }

        updateActiveCircle();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            numberInputs[index - 1].focus();
        }
    });

    input.addEventListener('focus', () => {
        updateActiveCircle();
    });
});

function updateActiveCircle() {
    numberCircles.forEach((circle, index) => {
        if (document.activeElement === numberInputs[index]) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    });
}

// Confirm Button
const confirmBtn = document.querySelector('.confirm-btn');
const accountInput = document.querySelector('.account-input');

confirmBtn.addEventListener('click', () => {
    const account = accountInput?.value.trim() || '';
    const numbers = Array.from(numberInputs).map(input => input.value).join('');
    
    if (!account) {
        alert('Vui lòng nhập tài khoản!');
        if (accountInput) accountInput.focus();
        return;
    }
    
    if (numbers.length === 4) {
        alert('Đã xác nhận:\nTài khoản: ' + account + '\n4 số đuôi: ' + numbers);
        // Reset inputs
        if (accountInput) accountInput.value = '';
        numberInputs.forEach(input => {
            input.value = '';
        });
        if (accountInput) accountInput.focus();
    } else {
        alert('Vui lòng nhập đủ 4 số đuôi tài khoản!');
        if (numberInputs[0]) numberInputs[0].focus();
    }
});

// Initialize first input focus
window.addEventListener('load', () => {
    if (accountInput) accountInput.focus();
});

