import React from 'react';

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
        <form id="search_form" onSubmit={handleSearch}>
            <div className="myMenu" onClick={() => onMenu(true)}>
                <img src={"./images/menu.png"} alt="Menu" />
            </div>
            <input
                type="text"
                id="keyword"
                size="15"
                value={searchTxt}
                onChange={onChangeTxt}
                placeholder="검색"
            />
            <div className="search_cancel" style={{ display: searchTxt ? "block" : "none" }}>
                <img src={"./images/cancel.png"} onClick={() => setSearchTxt("")} alt="Cancel" />
            </div>
            <button className="search_btn" type="submit">
                <img src={"./images/search.png"} alt="Search" />
            </button>
        </form>
    );
};

export default SearchForm;
