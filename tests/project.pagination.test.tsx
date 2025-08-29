import { fetchProjects } from '@/app/services/project';
import type { ProjectModel } from '@/app/context/projectContext';

// Keep base consistent with your service file
const base = 'http://localhost:8080/api';

describe('fetchProjects pagination params', () => {
  const mockProjects: ProjectModel[] = [
    { id: 1, name: 'P1', description: '', createdAt: new Date().toISOString(), updatedAt: null },
  ];

  beforeEach(() => {
    // Mock global fetch
    (global.fetch as unknown as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('appends limit and offset to the request URL', async () => {
    const result = await fetchProjects({ limit: 10, offset: 20 });
    expect(result).toEqual(mockProjects);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    // Assert exact URL shape (service sets limit first, then offset)
    expect(calledUrl).toBe(`${base}/project?limit=10&offset=20`);
  });

  it('appends q when provided', async () => {
    await fetchProjects({ limit: 5, offset: 0, q: 'alpha' });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(`${base}/project?limit=5&offset=0&q=alpha`);
  });
});
