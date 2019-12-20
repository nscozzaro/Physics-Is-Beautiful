import React from 'react';

// import ChevronRight from 'react-icons/lib/md/chevron-right';
// import ChevronLeft from 'react-icons/lib/fa/angle-double-left';
// import WarningIcon from 'react-icons/lib/md/warning';
// import ErrorIcon from 'react-icons/lib/md/error';

import { MdChevronRight as ChevronRight } from 'react-icons/md';
import { FaAngleDoubleLeft as ChevronLeft } from 'react-icons/fa';
import { MdWarning as WarningIcon } from 'react-icons/md';
import { MdError as ErrorIcon } from 'react-icons/md';

export function MessageIcon({ type, logType }) {
  if (type === 'command') {
    return <ChevronRight />;
  }

  if (type === 'return') {
    return <ChevronLeft />;
  }

  switch (logType) {
    case 'warning':
    case 'warn':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    default:
      return false;
  }
}
