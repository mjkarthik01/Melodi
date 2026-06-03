import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/search";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!values.keyword || values.keyword.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}?page=1&limit=5`,
        );
        setSuggestions(data?.result || data || []);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, [values.keyword]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!values.keyword.trim()) {
        return;
      }
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${values.keyword}`,
      );
      setValues({ ...values, results: data?.result || data || [] });
      navigate("/search");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error searching products");
    }
  };

  const handleSelectSuggestion = (item) => {
    setValues({ ...values, keyword: item.name, results: [item] });
    navigate("/search");
    setIsOpen(false);
  };

  return (
    <div
      className="search-box"
      onBlur={() => setTimeout(() => setIsOpen(false), 120)}
    >
      <form className="search-box__form" role="search" onSubmit={handleSubmit}>
        <input
          className="search-box__input"
          type="search"
          placeholder="Search products, categories..."
          aria-label="Search"
          value={values.keyword}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setValues({ ...values, keyword: e.target.value });
            setIsOpen(true);
          }}
        />
        <button className="search-box__button" type="submit">
          Search
        </button>
      </form>
      {isOpen && (suggestions?.length > 0 || loading) && (
        <div className="search-box__suggestions">
          {loading ? (
            <div className="search-box__item">Searching...</div>
          ) : (
            suggestions.map((item) => (
              <button
                key={item._id}
                type="button"
                className="search-box__item"
                onClick={() => handleSelectSuggestion(item)}
              >
                {item.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
