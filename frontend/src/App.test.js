import { render, screen } from '@testing-library/react';
import App from './App';

test('renders persistent app branding', () => {
  render(<App />);
  expect(screen.getByText(/chewlitics ai/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
});
