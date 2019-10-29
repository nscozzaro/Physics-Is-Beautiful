import React from 'react';
// import CrossIcon from 'react-icons/lib/md/clear';
import Margin from '../../../../common/components/spacing/Margin';
import Tooltip from '../../../../common/components/Tooltip';
import { Button } from '../../../../common/components/Button';
import { Details, Heading, Info, Action } from './elements';

interface IDetailInfoProps {
  heading: string;
  info: string;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export const DetailInfo: React.FC<IDetailInfoProps> = ({
  heading,
  info,
  onSignOut,
  onSignIn,
}) => (
  <Details>
    <Margin right={2}>
      <Heading>{heading}</Heading>
      <Info>{info}</Info>
    </Margin>

    {onSignOut ? (
      <Tooltip content="Sign out">
        <Action onClick={onSignOut} red>
          <CrossIcon />
        </Action>
      </Tooltip>
    ) : (
      <Button small onClick={onSignIn}>
        Sign in
      </Button>
    )}
  </Details>
);
