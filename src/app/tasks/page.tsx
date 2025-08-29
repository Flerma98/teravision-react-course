'use client';
import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useTask, TaskModel } from '../context/taskContext';
import { fetchTasks } from '@/app/services/task';
import { getErrorMessage } from '@/lib/errors';

export default function TasksPage() {
  const router = useRouter();
  const { setEditingTask } = useTask();

  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-driven pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const hasPrev = page > 1;
  const hasNext = useMemo(() => page < totalPages, [page, totalPages]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Request matches backend contract
        const result = await fetchTasks({
          pageNumber: page,
          pageSize,
          showAll: false,
        });
        setTasks(result.items);
        setTotalPages(result.totalPages || Math.max(1, Math.ceil(result.totalCount / result.pageSize)));
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page, pageSize]);

  const deleteTask = async (id: number) => {
    const res = await fetch(`http://localhost:8080/api/task/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error deleting task: ${errorText}`);
    }

    // After delete, refresh the current page from server.
    const nextLocal = tasks.filter(t => t.id !== id);
    if (nextLocal.length === 0 && page > 1) {
      setPage(p => Math.max(1, p - 1));
      return; // effect will refetch due to page change
    }

    try {
      const result = await fetchTasks({ pageNumber: page, pageSize, showAll: false });
      setTasks(result.items);
      setTotalPages(result.totalPages || Math.max(1, Math.ceil(result.totalCount / result.pageSize)));
    } catch {
      // Silent fallback
    }
  };

  const editTask = (task: TaskModel) => {
    setEditingTask(task);
    router.push(`tasks/form/${task.id}`);
  };

  const addTask = () => {
    setEditingTask(null);
    router.push('tasks/form');
  };

  return (
    <div>
      <header className="bg-orange-500 text-white p-4 shadow-md flex items-center gap-4">
        <h1 className="text-xl font-bold">Tasks</h1>
      </header>

      {/* Visual search kept for parity; not wired to API */}
      <div className="my-4 flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 rounded-full border border-gray-300"
            aria-label="Search tasks"
          />
        </div>

        {/* Page size selector */}
        <select
          aria-label="Page size"
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="border rounded px-3 py-2"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading tasks...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{task.name}</h2>
              <p className="text-sm text-gray-700 mt-2">{task.description}</p>
              <p className="text-sm text-gray-700 mt-3">Proyecto: {task.projectId}</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => editTask(task)} aria-label={`Edit task ${task.name}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500 hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>

              <button onClick={() => deleteTask(task.id)} aria-label={`Delete task ${task.name}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 hover:text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!hasPrev}
          aria-disabled={!hasPrev}
          aria-label="Prev page"
          className={`px-3 py-2 rounded border ${hasPrev ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
        >
          Prev
        </button>
        <span className="text-sm">
          Page <strong>{page}</strong> / {totalPages}
        </span>
        <button
          onClick={() => hasNext && setPage(p => p + 1)}
          disabled={!hasNext}
          aria-disabled={!hasNext}
          aria-label="Next page"
          className={`px-3 py-2 rounded border ${hasNext ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>

      {/* Floating action button */}
      <button
        onClick={addTask}
        className="fixed bottom-6 right-6 bg-orange-500 rounded-full w-14 h-14 text-white text-3xl flex items-center justify-center shadow-lg">
        +
      </button>
    </div>
  );
}
