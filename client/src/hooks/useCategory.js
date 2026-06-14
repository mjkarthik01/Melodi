import axios from "axios";
import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category?page=1&limit=100`,
      );
      setCategories(data?.category || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return [categories, loading];
}
