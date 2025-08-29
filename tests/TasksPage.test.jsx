import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TasksPage from '/src/app/tasks/page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../src/app/context/taskContext', () => ({
  useTask: () => ({ setEditingTask: mockPush }),
}));

// Mock global fetch with paginated envelope
beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch.mockImplementation((url) => {
    if (url.toString().includes("/api/task")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            { id: 1, name: "Title 1", description: "Lorem Ipsum 1", projectId: 1 },
            { id: 2, name: "Title 2", description: "Lorem Ipsum 2", projectId: 1 },
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

describe('TasksPage - Visual component', () => {
  it('renders the main heading with the text "Tasks"', async () => {
    render(<TasksPage />);
    expect(await screen.findByText('Tasks')).toBeInTheDocument();
  });

  it('renders the search input with placeholder text "Search"', async () => {
    render(<TasksPage />);
    expect(await screen.findByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('displays exactly two task titles', async () => {
    render(<TasksPage />);
    const titles = await screen.findAllByText(/^Title \d$/);
    expect(titles).toHaveLength(2);
  });

  it('renders a floating action button with the "+" symbol', async () => {
    render(<TasksPage />);
    expect(await screen.findByText('+')).toBeInTheDocument();
  });

  it('allows the user to type into the search input', async () => {
    render(<TasksPage />);
    const input = await screen.findByPlaceholderText('Search');
    await userEvent.type(input, 'Test');
    expect(input).toHaveValue('Test');
  });

  it('the floating action button links to "/tasks/form"', async () => {
    render(<TasksPage />);
    const button = await screen.findByRole('button', { name: '+' });
    await userEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('tasks/form');
  });

  it('renders the task descriptions containing placeholder text', async () => {
    render(<TasksPage />);
    const descriptions = await screen.findAllByText(/Lorem Ipsum/);
    expect(descriptions).toHaveLength(2);
  });
});
