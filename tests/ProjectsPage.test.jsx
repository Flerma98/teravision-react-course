import { render, screen } from '@testing-library/react';
import ProjectsPage from '/src/app/projects/page';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../src/app/context/projectContext', () => ({
  useProject: () => ({ setEditingProject: mockPush }),
}));

// Mock global fetch with paginated envelope
beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch.mockImplementation((url) => {
    if (url.toString().includes("/api/project")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            { id: 1, name: "Title 1", description: "Lorem Ipsum 1" },
            { id: 2, name: "Title 2", description: "Lorem Ipsum 2" },
          ],
          totalCount: 2,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
        }),
      });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });
});

afterEach(() => {
  jest.resetAllMocks();
  mockPush.mockClear();
});

describe('ProjectsPage - Visual component', () => {
  it('renders the main heading with the text "Projects"', async () => {
    render(<ProjectsPage />);
    expect(await screen.findByText('Projects')).toBeInTheDocument();
  });

  it('renders the search input with placeholder text "Search"', async () => {
    render(<ProjectsPage />);
    expect(await screen.findByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('displays exactly two project titles', async () => {
    render(<ProjectsPage />);
    const titles = await screen.findAllByText(/^Title \d$/);
    expect(titles).toHaveLength(2);
  });

  it('renders a floating action button with the "+" symbol', async () => {
    render(<ProjectsPage />);
    expect(await screen.findByText('+')).toBeInTheDocument();
  });

  it('allows the user to type into the search input', async () => {
    render(<ProjectsPage />);
    const input = await screen.findByPlaceholderText('Search');
    await userEvent.type(input, 'Test');
    expect(input).toHaveValue('Test');
  });

  it('the floating action button links to "/projects/form"', async () => {
    render(<ProjectsPage />);
    const button = await screen.findByRole('button', { name: '+' });
    await userEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('projects/form');
  });

  it('renders the project descriptions containing placeholder text', async () => {
    render(<ProjectsPage />);
    const descriptions = await screen.findAllByText(/Lorem Ipsum/);
    expect(descriptions).toHaveLength(2);
  });
});
