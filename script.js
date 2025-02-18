document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.getElementById('cookie');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    cookie.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;
        cookie.classList.add('clicked');
        setTimeout(() => {
            cookie.classList.remove('clicked');
        }, 100);
    });
});
