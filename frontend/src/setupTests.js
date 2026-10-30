// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jest 27's jsdom does not expose TextEncoder / TextDecoder, which
// react-router v7 creates at import time (URL encoding). Node provides
// both, so they are installed as globals before any test module loads.
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
