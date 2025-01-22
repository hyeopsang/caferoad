import React from "react";

const SearchForm = ({ onSearch, searchTxt, setSearchTxt, onMenu }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTxt.trim() === "") return;
    onSearch(searchTxt);
  };

  const onChangeTxt = (e) => {
    setSearchTxt(e.target.value);
  };

  return (
    <form
      className="fixed left-1/2 top-[15px] z-10 flex h-fit min-w-[365px] max-w-[418px] -translate-x-1/2 justify-between gap-0 rounded-[15px] bg-white shadow-md"
      id="search_form"
      onSubmit={handleSearch}
    >
      <button className="h-[55px] p-[15px]" onClick={() => onMenu(true)}>
        <img className="w-[25px]" src={"./images/menu.png"} alt="Menu" />
      </button>
      <input
        type="text"
        id="keyword"
        size="15"
        className="w-[calc(100%-140px)] bg-white outline-none"
        value={searchTxt}
        onChange={onChangeTxt}
        placeholder="검색"
      />
      <div className="z-20 flex w-[30px] items-center px-[5px]">
        <img
          src={"./images/cancel.png"}
          onClick={() => setSearchTxt("")}
          alt="Cancel"
          style={{ display: searchTxt ? "block" : "none" }}
        />
      </div>
      <button className="h-[55px] p-[15px]">
        <img className="w-[25px]" src={"./images/search.png"} alt="Search" />
      </button>
    </form>
  );
};

export default SearchForm;
