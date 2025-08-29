import { fetchProjects } from '@/app/services/project';
import type { ProjectModel } from '@/app/context/projectContext';

describe('fetchProjects pagination params (server envelope)', () => {
  beforeEach(() => {
    (global.fetch as unknown as jest.Mock) = jest.fn();
  });

  it('uses correct defaults', async () => {
    const envelope = { items: [], totalCount: 0, currentPage: 1, pageSize: 10, totalPages: 1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => envelope });

    const result = await fetchProjects();
    expect(result).toEqual(envelope);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe("http://localhost:8080/api/project?showAll=false&pageNumber=1&pageSize=10");
  });

  it('appends given pageNumber and pageSize', async () => {
    const envelope = { items: [] as ProjectModel[], totalCount: 0, currentPage: 2, pageSize: 20, totalPages: 1 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => envelope });

    await fetchProjects({ pageNumber: 2, pageSize: 20, showAll: false });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe("http://localhost:8080/api/project?showAll=false&pageNumber=2&pageSize=20");
  });
});
