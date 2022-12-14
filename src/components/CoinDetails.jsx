import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CryptoContext } from '../context/CryptoContext';
import '../style/CoinDetails.css';
import Header from './Header';
import FavoriteCoin from './FavoriteButton';
import CoinChart from './CoinChart';

const CoinDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coin, setCoin] = useState(null);
  const { currency, symbol } = useContext(CryptoContext);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(false);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`,
        );
        const data = await response.json();
        setCoin(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Header />
      {error && (
        <div div className="error-container">
          <p className="error-message">Server responds with error 404!</p>
        </div>
      )}
      {isLoading && (
        <div className="loading-container">
          <p className="loading">Loading ...</p>
        </div>
      )}
      {coin && (
        <div className="page-container">
          <div className="coin-detail">
            <img
              className="coin-page-image"
              src={coin?.image?.large}
              alt={coin?.name}
            />
            <h3 className="coin-page-name">{coin?.id}</h3>
            <p className="coin-page-desc">
              {coin?.description?.en?.split('. ')[0]}
            </p>
            <div className="coin-page-info">
              <h4>Rank: {coin?.market_cap_rank}</h4>
              <h4>
                Current Price: {symbol}{' '}
                {coin?.market_data.current_price[currency?.toLowerCase()]}
              </h4>
              <h4>
                Market Cap: {symbol}{' '}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency?.toLowerCase()]
                    .toString()
                    .slice(0, -6),
                )}
                M
              </h4>
            </div>
            <FavoriteCoin coin={coin} />
            <Link className="coin-page-back-link" to="/">
              <button className="coin-page-back-btn">Back to home</button>
            </Link>
          </div>
          <CoinChart coin={coin} />
        </div>
      )}
    </>
  );
};

export default CoinDetails;
