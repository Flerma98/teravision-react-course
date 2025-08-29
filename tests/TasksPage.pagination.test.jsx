import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TasksPage from '/src/app/tasks/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('/src/app/context/taskContext', () => ({ useTask: () => ({ setEditingTask: jest.fn() }) }));

function envelope(items, page = 1, pageSize = 10, totalPages = 1) {
  return { items, totalCount: items.length, currentPage: page, pageSize, totalPages };
}

describe('TasksPage - pagination behavior (server envelope)', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('goes next then back and requests correct pageNumber/pageSize', async () => {
    const pageSize = 10;
    const items1 = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1, projectId: 1, name: `T${i + 1}`, description: '',
    }));
    const items2 = [{ id: 200, projectId: 1, name: 'T200', description: '' }];

    const fetchMock = global.fetch;
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => envelope(items1, 1, pageSize, 2) }) // first page
      .mockResolvedValueOnce({ ok: true, json: async () => envelope(items2, 2, pageSize, 2) }) // second page
      .mockResolvedValueOnce({ ok: true, json: async () => envelope(items1, 1, pageSize, 2) }); // back to first

    render(<TasksPage />);

    expect(await screen.findByText('T1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next page/i }));
    await waitFor(() => expect(screen.getByText('T200')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Next page/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Prev page/i }));
    await waitFor(() => expect(screen.getByText('T1')).toBeInTheDocument());

    const urls = fetchMock.mock.calls.map(c => c[0].toString());
    expect(urls[0]).toContain('pageNumber=1'); expect(urls[0]).toContain('pageSize=10');
    expect(urls[1]).toContain('pageNumber=2'); expect(urls[1]).toContain('pageSize=10');
    expect(urls[2]).toContain('pageNumber=1'); expect(urls[2]).toContain('pageSize=10');
  });
});
