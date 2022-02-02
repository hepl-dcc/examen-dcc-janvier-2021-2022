import {Player} from "./Player";
import {settings} from "./settings";
import {utils} from "./utils";

const Tymper = {
    init() {
        this.eScore = document.querySelector(".information__score")
        this.eWrongCards = document.querySelector('.wrong-cards');
        this.dataList = document.querySelector('#fonts')
        this.eApp = document.querySelector('.app');
        this.eTimeLeft = document.querySelector('.information__time');
        this.eFontName = document.querySelector('#font');
        this.eFontFamily = document.querySelector('#family');
        this.eCurrentCard = this.eApp.querySelector('.app__item:last-child');
        this.ePlayAgain = document.querySelector('#play-again');
        this.ePlay = document.querySelector('#play')
        this.iMaxScore = window.fonts.length;
        this.sPrefixMessageForTimeLeft = this.eTimeLeft.dataset.text;
        this.sPrefixMessageForScore = this.eScore.dataset.text;
        this.isPlaying = false;
        this.ePlay.addEventListener('submit', (event) => this.play(event));
        this.ePlayAgain.addEventListener('submit', (event) => {
            this.eWrongCards.innerHTML = "";
            event.preventDefault();
            this.ePlayAgain.classList.toggle('play--again--hidden');
            this.start();
        })
        this.generateDataOptions();
        this.start()
    },
    start() {
        this.player = new Player();
        this.iTimeLeft = settings.maxTimePerCard;
        this.eFontName.focus();
        this.generateFontCards();
        this.displayScore();
        this.displayTime();
        if (settings.withTimer) {
            this.timer = setInterval(() => {
                this.updateTime()
            }, settings.maxTimePerCard * 100);
        }
    },
    displayScore() {
        this.eScore.innerHTML = `${this.sPrefixMessageForScore} <span>${this.player.score}/${this.iMaxScore}</span>`
    },
    play(event) {
        event.preventDefault();
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.eCurrentCard = this.eApp.querySelector('.app__item:last-child');
            if (this.eFontName.value === this.eCurrentCard.dataset.fontName && this.eFontFamily.value === this.eCurrentCard.dataset.family) {
                this.eCurrentCard.classList.add('app__item--move', `app__item--move--success`);
                this.player.increaseScore(1);
            } else if (this.eFontName.value === this.eCurrentCard.dataset.fontName || this.eFontFamily.value === this.eCurrentCard.dataset.family) {
                this.eWrongCards.insertAdjacentElement('afterbegin', this.eCurrentCard.cloneNode(true));
                this.eCurrentCard.classList.add('app__item--move', `app__item--move--error`);
                this.player.increaseScore(0.5);
            } else {
                this.eWrongCards.insertAdjacentElement('afterbegin', this.eCurrentCard.cloneNode(true));
                this.eCurrentCard.classList.add('app__item--move', `app__item--move--error`);
            }
            this.iTimeLeft = settings.maxTimePerCard;
            this.displayTime();
            this.afterPlay();
        }

    },
    afterPlay() {
        this.eFontName.value = '';
        this.eFontFamily.value = '';
        this.eFontName.focus();
        this.eCurrentCard.addEventListener('transitionend', (event) => {
            event.currentTarget.remove();
            if (this.eApp.childElementCount === 0) {
                clearInterval(this.timer);
                this.ePlayAgain.classList.toggle('play--again--hidden');
            }
            this.isPlaying = false;
        });
        this.displayScore();
    },

    generateFontCards() {
        for (const font of settings.doShuffle ? utils.shuffle(fonts) : fonts.reverse()) {
            this.eApp.insertAdjacentHTML('beforeend',
                `<li data-font-name="${font.name}" data-family="${font.family}" class='app__item'><div class="app__item__info">
                        <span class="app__item__info__name">${font.name}</span><span class="app__item__info__info">${font.family} - ${font.author}</span></div><img class='app__item__font' src='./assets/fonts/${font.file}.svg' alt='Aa, abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ'>
                        </li>`)
        }
    },
    generateDataOptions() {
        for (const font of fonts) {
            this.dataList.insertAdjacentHTML('beforeend', `<option value='${font.name}'>`)
        }
    },
    updateTime() {
        if (this.iTimeLeft === 0) {
            this.eCurrentCard = this.eApp.querySelector('.app__item:last-child');
            this.eWrongCards.insertAdjacentElement('afterbegin', this.eCurrentCard.cloneNode(true));
            this.eCurrentCard.classList.add('app__item--move', `app__item--move--error`);
            this.afterPlay();
            this.iTimeLeft = settings.maxTimePerCard;
        } else {
            this.iTimeLeft--;
        }
        this.displayTime();
    },
    displayTime() {
        this.eTimeLeft.innerHTML = `${this.sPrefixMessageForTimeLeft} <time datetime="${this.formatTime(this.iTimeLeft)}">${this.formatTime(this.iTimeLeft)}</time>`
    },
    formatTime(seconds) {
        return `${this.zeros(Math.floor(seconds / 60))}:${this.zeros(seconds % 60)}`
    },
    zeros(digit) {
        if (digit < 10) {
            return `0${digit}`;
        }
        return digit;
    }
}

Tymper.init();
