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
    <form className="fixed flex justify-between gap-0 bg-white z-10 top-[15px] left-1/2 -translate-x-1/2 min-w-[365px] max-w-[418px] h-fit rounded-[15px] shadow-md" id="search_form" onSubmit={handleSearch}>
      <button className="p-[15px] h-[55px]" onClick={() => onMenu(true)}>
        <img className="w-[25px]" src={"./images/menu.png"} alt="Menu" />
      </button>
      <input
        type="text"
        id="keyword"
        size="15"
        className="w-[calc(100%-140px)] outline-none"
        value={searchTxt}
        onChange={onChangeTxt}
        placeholder="검색"
      />
      <div
        className="w-[30px] px-[5px] z-20 flex items-center"
        
      >
        <img
          src={"./images/cancel.png"}
          onClick={() => setSearchTxt("")}
          alt="Cancel"
          style={{ display: searchTxt ? "block" : "none" }}
        />
      </div>
      <button className="p-[15px] h-[55px]">
        <img className="w-[25px]" src={"./images/search.png"} alt="Search" />
      </button>
    </form>
  );
};

export default SearchForm;
