import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TasksPage from '/src/app/tasks/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('/src/app/context/taskContext', () => ({
  useTask: () => ({ setEditingTask: jest.fn() }),
}));

function jsonOk(body) {
  return { ok: true, json: async () => body };
}

describe('TasksPage - pagination behavior', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('goes next then back and requests correct limit/offset', async () => {
    const pageSize = 10;
    const page1 = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1, projectId: 1, name: `T${i + 1}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));
    const page2 = Array.from({ length: 1 }, (_, i) => ({
      id: 200 + i, projectId: 1, name: `T${200 + i}`, description: '', createdAt: new Date().toISOString(), updatedAt: null,
    }));

    const fetchMock = global.fetch; // jest.Mock
    fetchMock
      .mockResolvedValueOnce(jsonOk(page1)) // first page
      .mockResolvedValueOnce(jsonOk(page2)) // second page
      .mockResolvedValueOnce(jsonOk(page1)); // back to first page

    render(<TasksPage />);

    expect(await screen.findByText('T1')).toBeInTheDocument();

    // Next → page 2
    fireEvent.click(screen.getByRole('button', { name: /Next page/i }));
    await waitFor(() => expect(screen.getByText('T200')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Next page/i })).toBeDisabled();

    // Prev → back to page 1
    fireEvent.click(screen.getByRole('button', { name: /Prev page/i }));
    await waitFor(() => expect(screen.getByText('T1')).toBeInTheDocument());

    const urls = fetchMock.mock.calls.map(c => c[0].toString());
    expect(urls[0]).toContain('limit=10'); expect(urls[0]).toContain('offset=0');
    expect(urls[1]).toContain('limit=10'); expect(urls[1]).toContain('offset=10');
    expect(urls[2]).toContain('limit=10'); expect(urls[2]).toContain('offset=0');
  });
});
