import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from "./fetchCountries";
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
const MAX_COUNTRY_IN_LIST = 10;
const MIN_COUNTRY_IN_LIST = 2;

const refs = {
    input: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));

function onInputHandler(e) {
    e.preventDefault();
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    let inputSymbols = e.target.value.trim();
    if (inputSymbols) {
        fetchCountries(inputSymbols)
            .then(showCountry)
            .catch(error => console.log(error));
    }
}

function showCountry(payload) {
    if (payload.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (payload.length <= MAX_COUNTRY_IN_LIST && payload.length >= MIN_COUNTRY_IN_LIST) {
        return renderCountyList(payload);
    } else {
        return renderOneCountry(payload);
    }
}

function renderCountyList(payload) {
    const countryList = payload.reduce((acc, country) => {
        return (
            acc +
            `<li class="list"><img class="info-img" src="${country.flags.svg}" alt=""><p class="country">${country.name.official}</p></li>`
        );
    }, '');
    refs.countryList.insertAdjacentHTML('beforeend', countryList);
}

function renderOneCountry(payload) {
    refs.countryInfo.innerHTML = '';
    const oneCountry = payload.map(
        country =>
            `<div class="title"><img class="info-img" src="${country.flags.svg
            }" alt=""><p class="country">${country.name.official
            }</p></div><p class="prop-value"><span class="prop-title">Capital:</span> ${country.capital
            }</p><p class="prop-value"><span class="prop-title">Population</span>: ${country.population
            }</p><p class="prop-value"><span class="prop-title">Languages:</span> ${Object.values(
                country.languages,
            ).join(', ')} </p>`
    );
    refs.countryInfo.insertAdjacentHTML('beforeend', oneCountry);
}