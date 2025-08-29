import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProjectsPage from '/src/app/projects/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('/src/app/context/projectContext', () => ({
  useProject: () => ({ setEditingProject: jest.fn() }),
}));

function jsonOk(body) {
  return { ok: true, json: async () => body };
}

describe('ProjectsPage - pagination behavior', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables "Next" when received fewer items than pageSize', async () => {
    const page1 = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1, name: `P${i + 1}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));
    
    global.fetch.mockResolvedValue(jsonOk(page1));

    render(<ProjectsPage />);

    for (const name of ['P1', 'P5']) {
      expect(await screen.findByText(name)).toBeInTheDocument();
    }

    const nextBtn = screen.getByRole('button', { name: /Next page/i });
    expect(nextBtn).toBeDisabled();
  });

  it('navigates to next page and requests correct limit/offset', async () => {
    const pageSize = 10;
    const page1 = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1, name: `P${i + 1}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));
    const page2 = Array.from({ length: 2 }, (_, i) => ({
      id: 100 + i, name: `P${100 + i}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));

    const fetchMock = global.fetch; // jest.Mock
    fetchMock
      .mockResolvedValueOnce(jsonOk(page1)) // first page
      .mockResolvedValueOnce(jsonOk(page2)); // second page

    render(<ProjectsPage />);

    expect(await screen.findByText('P1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next page/i }));
    await waitFor(() => expect(screen.getByText('P100')).toBeInTheDocument());

    const urls = fetchMock.mock.calls.map(c => c[0].toString());
    expect(urls[0]).toContain('limit=10'); expect(urls[0]).toContain('offset=0');
    expect(urls[1]).toContain('limit=10'); expect(urls[1]).toContain('offset=10');
  });
});
