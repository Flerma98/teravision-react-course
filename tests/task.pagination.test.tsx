import { fetchTasks } from '@/app/services/task';
import type { TaskModel } from '@/app/context/taskContext';

describe('fetchTasks pagination params (server envelope)', () => {
  beforeEach(() => {
    (global.fetch as unknown as jest.Mock) = jest.fn();
  });

  it('uses correct defaults', async () => {
    const envelope = { items: [], totalCount: 0, currentPage: 1, pageSize: 10, totalPages: 1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => envelope });

    const result = await fetchTasks();
    expect(result).toEqual(envelope);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe("http://localhost:8080/api/task?showAll=false&pageNumber=1&pageSize=10");
  });

  it('appends given pageNumber and pageSize', async () => {
    const envelope = { items: [] as TaskModel[], totalCount: 0, currentPage: 3, pageSize: 50, totalPages: 1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => envelope });

    await fetchTasks({ pageNumber: 3, pageSize: 50, showAll: false });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe("http://localhost:8080/api/task?showAll=false&pageNumber=3&pageSize=50");
  });
});
