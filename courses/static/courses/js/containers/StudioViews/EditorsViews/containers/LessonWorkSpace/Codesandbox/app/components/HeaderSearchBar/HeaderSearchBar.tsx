import React, { useState } from 'react';
import history from '../../../app/utils/history';
import { searchUrl } from '../../common/utils/url-generator';
import { Container, Input, SearchButton, SearchIcon } from './elements';

export const HeaderSearchBar = () => {
  const [query, setQuery] = useState(``);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push(searchUrl(query));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Container role="search">
        <Input
          aria-label="Search sandboxes"
          placeholder="Search sandboxes"
          value={query}
          onChange={handleChange}
          id="search-sandboxes"
          type="text"
        />
        <SearchButton type="submit" aria-labelledby="search-sandboxes">
          <SearchIcon />
        </SearchButton>
      </Container>
    </form>
  );
};
