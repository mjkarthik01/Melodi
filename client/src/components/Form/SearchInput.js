import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/search";

const SearchInput = ({ onClose }) => {
  const [values, setValues] = useSearch();
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
      className="search-overlay"
      onBlur={() => setTimeout(() => setIsOpen(false), 120)}
    >
      <div className="search-box" ref={boxRef}>
        <form
          className="search-box__form"
          role="search"
          onSubmit={handleSubmit}
        >
          <input
            autoFocus
            className="search-box__input"
            type="search"
            placeholder="Search products, categories..."
            value={values.keyword}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setValues({ ...values, keyword: e.target.value });
              setIsOpen(true);
            }}
          />

          <button type="submit" className="search-box__button">
            <i className="bi bi-search" />
          </button>
        </form>

        {isOpen && (
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
    </div>
  );
};

export default SearchInput;
