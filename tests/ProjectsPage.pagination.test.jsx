import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProjectsPage from '/src/app/projects/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('/src/app/context/projectContext', () => ({ useProject: () => ({ setEditingProject: jest.fn() }) }));

function envelope(items, page = 1, pageSize = 10, totalPages = 1) {
  return { items, totalCount: items.length, currentPage: page, pageSize, totalPages };
}

describe('ProjectsPage - pagination behavior (server envelope)', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables "Next" when current page equals totalPages', async () => {
    const page1 = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1, name: `P${i + 1}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));

    global.fetch.mockResolvedValue({ ok: true, json: async () => envelope(page1, 1, 10, 1) });

    render(<ProjectsPage />);

    // Initial load
    for (const name of ['P1', 'P5']) {
      expect(await screen.findByText(name)).toBeInTheDocument();
    }
    const nextBtn = screen.getByRole('button', { name: /Next page/i });
    expect(nextBtn).toBeDisabled();
  });

  it('navigates to next page and requests correct pageNumber/pageSize', async () => {
    const pageSize = 10;
    const items1 = Array.from({ length: pageSize }, (_, i) => ({ id: i + 1, name: `P${i + 1}`, description: '' }));
    const items2 = Array.from({ length: 2 }, (_, i) => ({ id: 100 + i, name: `P${100 + i}`, description: '' }));

    const fetchMock = global.fetch;
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => envelope(items1, 1, pageSize, 2) }) // first page
      .mockResolvedValueOnce({ ok: true, json: async () => envelope(items2, 2, pageSize, 2) }); // second page

    render(<ProjectsPage />);

    expect(await screen.findByText('P1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next page/i }));
    await waitFor(() => expect(screen.getByText('P100')).toBeInTheDocument());

    const urls = fetchMock.mock.calls.map(c => c[0].toString());
    expect(urls[0]).toContain('pageNumber=1'); expect(urls[0]).toContain('pageSize=10');
    expect(urls[1]).toContain('pageNumber=2'); expect(urls[1]).toContain('pageSize=10');
  });
});
