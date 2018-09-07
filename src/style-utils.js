import { css } from 'styled-components';

export const media = {
  handheld: (...args) => css`
    @media all and (max-width: 750px) {
      ${css(...args)}
    }
  `,
};
