import { fetchTasks } from '@/app/services/task';
import type { TaskModel } from '@/app/context/taskContext';

const base = 'http://localhost:8080/api';

describe('fetchTasks pagination params', () => {
  const mockTasks: TaskModel[] = [
    { id: 10, projectId: 1, name: 'T1', description: '', createdAt: new Date().toISOString(), updatedAt: null },
  ];

  beforeEach(() => {
    // Mock global fetch
    (global.fetch as unknown as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('appends limit and offset to the request URL', async () => {
    const result = await fetchTasks({ limit: 10, offset: 0 });
    expect(result).toEqual(mockTasks);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(`${base}/task?limit=10&offset=0`);
  });
});
