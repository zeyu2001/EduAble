import React from 'react';

const useExtendedState = (initialState) => {
  const [state, setState] = React.useState(initialState);
  const getLatestState = () => {
    return new Promise((resolve, reject) => {
      setState((s) => {
        resolve(s);
        return s;
      });
    });
  };

  return [state, setState, getLatestState];
}

export { useExtendedState };