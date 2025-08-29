import { render, screen, waitFor } from '@testing-library/react';
import EventsPage from '/src/app/events/page';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush
    }),
}));

jest.mock('../src/app/context/eventContext', () => ({
    useEvent: () => ({
        setEditingEvent: mockPush
    }),
}));

// Mock global fetch
beforeAll(() => {
    global.fetch = jest.fn(); // 👈 agrega fetch al global
});

beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
        if (url.toString().includes("/api/event")) {
            return Promise.resolve({
                ok: true,
                json: async () => [
                    { id: 1, name: "Title 1", description: "Lorem Ipsum 1" },
                    { id: 2, name: "Title 2", description: "Lorem Ipsum 2" },
                ],
            });
        }
        return Promise.reject(new Error("Unknown endpoint"));
    });
});

afterEach(() => {
    jest.resetAllMocks();
    mockPush.mockClear();
});

describe('EventsPage - Visual component', () => {
    it('renders the main heading with the text "Events"', async () => {
        render(<EventsPage />);
        expect(await screen.findByText('Events')).toBeInTheDocument();
    });

    it('renders the search input with placeholder text "Search"', async () => {
        render(<EventsPage />);
        expect(await screen.findByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('displays exactly two event titles', async () => {
        render(<EventsPage />);
        const titles = await screen.findAllByText(/^Title \d$/);
        expect(titles).toHaveLength(2);
    });

    it('renders a floating action button with the "+" symbol', async () => {
        render(<EventsPage />);
        expect(await screen.findByText('+')).toBeInTheDocument();
    });

    it('allows the user to type into the search input', async () => {
        render(<EventsPage />);
        const input = await screen.findByPlaceholderText('Search');
        await userEvent.type(input, 'Test');
        expect(input).toHaveValue('Test');
    });

    it('the floating action button links to "/events/form"', async () => {
        render(<EventsPage />);
        const button = await screen.findByRole('button', { name: '+' });
        await userEvent.click(button);
        expect(mockPush).toHaveBeenCalledWith('events/form');
    });

    it('renders the event descriptions containing placeholder text', async () => {
        render(<EventsPage />);
        const descriptions = await screen.findAllByText(/Lorem Ipsum/);
        expect(descriptions).toHaveLength(2);
    });
});
