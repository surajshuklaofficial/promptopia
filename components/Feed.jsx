"use client"

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard.jsx';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {
        data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
        ))
      }
    </div>
  );
};

const Feed = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null)

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(() => e.target.value );
    
    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    )
  }

  const filterPrompts = (searchText) => {
    const regex = new RegExp( searchText, 'i');

    return posts.filter(
      (item) => 
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    )
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('api/prompt');

      const data = await response.json();

      setPosts(data);
    }

    fetchPosts();
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchResults(searchResult);
  }

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {searchText ? (
        <PromptCardList
          data={searchResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}

    </section>
  )
}

export default Feed;