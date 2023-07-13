import {useState} from 'react'


function Search({searchUni, searchUniversities}) {
    return (
        <div className="search-background">
            <input onChange= {searchUniversities} className= "search-bar" value={searchUni} placeholder= 'Search'/>
        </div>
    )
}

export default Search