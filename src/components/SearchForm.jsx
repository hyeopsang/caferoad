// SearchForm.js
import React, { useState } from 'react';
import Search from "../images/search.png";
import Cancel from "../images/cancel.png";
import menu from "../images/menu.png";


const SearchForm = ({ onSearch , searchTxt, setSearchTxt, onMenu  }) => {

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTxt);
    };
    const onChangeTxt = (e) => {
        setSearchTxt(e.target.value);
    };

    return (
        <form id="search_form" onSubmit={handleSearch}>
            <div className="myMenu" onClick={()=>onMenu(true)}>
                <img src={menu}/>
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
                <img src={Cancel} onClick={() => setSearchTxt("")} alt="Cancel" />
            </div>
            <button className="search_btn" type="submit">
                <img src={Search} alt="Search" />
            </button>
        </form>
    );
};

export default SearchForm;
