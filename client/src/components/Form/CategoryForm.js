import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter the new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="btn btn-primary mt-3" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
