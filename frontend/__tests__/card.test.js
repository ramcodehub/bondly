import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';

describe('Card Component', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <Card data-testid=\"test-card\">
        <CardHeader data-testid=\"test-header\">
          <CardTitle data-testid=\"test-title\">Test</CardTitle>
        </CardHeader>
        <CardContent data-testid=\"test-content\">Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('test-card');
    const header = screen.getByTestId('test-header');
    const title = screen.getByTestId('test-title');
    const content = screen.getByTestId('test-content');

    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    expect(title).toHaveClass('text-2xl', 'font-semibold');
    expect(content).toHaveClass('p-6', 'pt-0');
  });
});