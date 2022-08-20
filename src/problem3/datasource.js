// your code here:

/** Class representing a Datasource */
class Datasource {
  /**
   * Create a new Datasource.
   * @param {string} url - The url to the datasource.
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * Fetch the price data from the datasource URL provided and add two new custom methods to the returned object.
   * @returns {Promise} - A promise that resolves to the price data with two methods - mid and quote.
   */
  getPrices() {
    return fetch(this.url)
      .then((response) => response.json())
      .then(({ data }) => data)
      .then(({ prices }) => {
        return prices.map((price) => ({
          ...price,
          mid: () => this.#mid(price),
          quote: () => this.#quote(price),
        }));
      });
  }

  /**
   *  Calculate the mid price of a price object.
   * @param {number} price - The price object that contains the buy and sell prices.
   * @returns {number} - The mid price.
   */
  #mid(price) {
    return (price.buy + price.sell) / 2.0 / 100;
  }

  /**
   * Get the quote for a price object.
   * This solution assumes that the last 3 character of the string is the quote.
   * @param {number} price - The price object that contains the buy and sell prices.
   * @returns {string} - The quote.
   */
  #quote(price) {
    return price.pair.slice(-3);
  }
}

const ds = new Datasource('https://static.ngnrs.io/test/prices');

ds.getPrices()
  .then((prices) => {
    prices.forEach((price) => {
      console.log(`Mid price for ${price.pair} is ${price.mid()} ${price.quote()}.`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
