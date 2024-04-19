import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Components/Home/Home';

test('renders learn react link', () => {
  render(<Home />);
  const linkElement = screen.getByText(/SKM/i);
  expect(linkElement).toBeInTheDocument();
});
