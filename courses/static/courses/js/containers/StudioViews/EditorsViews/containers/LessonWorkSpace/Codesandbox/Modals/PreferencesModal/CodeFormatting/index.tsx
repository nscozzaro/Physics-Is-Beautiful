import React, { FunctionComponent } from 'react';

import Question from 'react-icons/lib/go/question';

import { Prettier } from './Prettier';
import { Title } from '../elements';

export const CodeFormatting: FunctionComponent = () => (
  <div>
    <Title>
      Prettier Settings{' '}
      <a
        href="https://prettier.io/docs/en/options.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Question style={{ marginBottom: '3px' }} />
      </a>
    </Title>

    <Prettier />
  </div>
);
