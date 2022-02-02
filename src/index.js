import axios from 'axios'

const FIXER_API_KEY = '126517f0c398fb8f930bff5736adcbfb'
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`

const REST_COUNTRIES_KEY = '7a90d32a184c3fc8986dde7a50a58695'
const REST_COUNTRIES_API = (currency) =>
    `http://api.countrylayer.com/v2/currency/${currency}?access_key=${REST_COUNTRIES_KEY}`

// Fetch data about currencies

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const {
            data: { rates },
        } = await axios.get(FIXER_API)
        return rates[toCurrency] / rates[fromCurrency]
    } catch (err) {
        throw new Error({ err })
    }
}

//getExchangeRate('USD', 'EUR')

// Fetch data about countries
const getCountries = async (currency) => {
    try {
        const { data } = await axios.get(REST_COUNTRIES_API(currency))
        return data.map(({ name }) => name)
    } catch (err) {
        throw new Error({ err })
    }
}

//convertCurrency

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase()
    toCurrency = toCurrency.toUpperCase()

    const [exchangeRate, countries] = await Promise.all([
        await getExchangeRate(fromCurrency, toCurrency),
        await getCountries(toCurrency),
    ])

    const convertedAmount = (amount * exchangeRate).toFixed(2)
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. you can spend these in the following countries: ${countries}`
}

convertCurrency('USD', 'EUR', 20)
    .then((result) => console.log(result))
    .catch((err) => console.error({ err }))
