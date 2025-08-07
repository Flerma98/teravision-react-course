import { render, screen } from '@testing-library/react';
import ProjectsPage from '/src/app/projects/page';
import userEvent from '@testing-library/user-event';

describe('ProjectsPage Component', () => {
    it('renders the main heading with the text "Projects"', () => {
        render(<ProjectsPage />);
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('renders the search input with placeholder text "Search"', () => {
        render(<ProjectsPage />);
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('displays exactly two project titles with the text "Title"', () => {
        render(<ProjectsPage />);
        const titles = screen.getAllByText('Title');
        expect(titles).toHaveLength(2);
    });

    it('renders a floating action button with the "+" symbol', () => {
        render(<ProjectsPage />);
        expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('allows the user to type into the search input', async () => {
        render(<ProjectsPage />);
        const input = screen.getByPlaceholderText('Search');
        await userEvent.type(input, 'Test');
        expect(input).toHaveValue('Test');
    });

    it('the floating action button links to "/projects/form"', () => {
        render(<ProjectsPage />);
        const buttonLink = screen.getByRole('link', { name: '+' });
        expect(buttonLink).toHaveAttribute('href', '/projects/form');
    });

    it('renders the project descriptions containing placeholder text', () => {
        render(<ProjectsPage />);
        const descriptions = screen.getAllByText(/Lorem Ipsum/);
        expect(descriptions).toHaveLength(2);
    });
});