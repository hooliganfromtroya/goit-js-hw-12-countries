import { debounce } from 'lodash';
import countryTemplate from './partials/country.hbs';
import fetchCountries from './fetchCountries';
import {error} from '@pnotify/core'
import '@pnotify/core/BrightTheme.css'
import '@pnotify/core/dist/PNotify.css'
import './sass/main.scss';


const refs = {
    input: document.querySelector('.search__input'),
    searchOutput: document.querySelector('.search__output')
}

const createList = list => {
    return `
        <ul>
            ${list.map(country => {
                return `<li>${country.name}</li>`
            }).join('')}
        </ul>
    `
}

const createSimpleCountry = (data) => {
    return data.map(countryTemplate).join('');
}

const renderHtml = (html) => {
    refs.searchOutput.innerHTML = html
}

const responseHandler = (response) => {
    const result = response.length > 1 ? createList(response) : createSimpleCountry(response);
    renderHtml(result);
    if (response.length > 10) {
        error({
            text: 'Too many matches found. Please enter a more specific query!'
        })
    }
}

const catchHandler = () => {
    renderHtml('')
    error({
        text: 'Not found'
    })
}

const getCountriesByName = (e) => {
    fetchCountries(e.target.value)
        .then(res => res.json())
        .then(responseHandler)
        .catch(catchHandler)
}

refs.input.addEventListener('input', debounce(getCountriesByName, 500));