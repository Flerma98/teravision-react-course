import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '/src/app/tasks/form/page';

const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        back: mockBack
    }),
}));

const mockCreateTask = jest.fn();
jest.mock('/src/app/tasks/form/action', () => ({
    createTask: jest.fn((formData) => mockCreateTask(formData)),
}));

// --- Mock del fetch de proyectos ---
const mockProjects = [
    { id: 1, name: "Project A", description: "", createdAt: "2024-01-01" },
    { id: 2, name: "Project B", description: "", createdAt: "2024-01-01" },
];

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockProjects),
        })
    );
});


describe('TaskForm - Visual component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the main heading "Create Task"', async () => {
        render(<TaskForm />);
        expect(await screen.findByText('Create Task')).toBeInTheDocument();
    });

    it('renders back button with aria-label "Go back"', async () => {
        render(<TaskForm />);
        expect(await screen.findByLabelText('Go back')).toBeInTheDocument();
    });

    it('renders the name input as required', async () => {
        render(<TaskForm />);
        const nameInput = await screen.findByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders the description textarea', async () => {
        render(<TaskForm />);
        expect(await screen.findByLabelText(/Description/i)).toBeInTheDocument();
    });

    it('renders the project select input', async () => {
        render(<TaskForm />);
        const projectSelect = await screen.findByLabelText(/Project/i);
        expect(projectSelect).toBeInTheDocument();
        expect(projectSelect).toBeRequired();
    });

    it('renders the submit button with text "Create"', async () => {
        render(<TaskForm />);
        expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('calls router.back() when clicking the back button', async () => {
        render(<TaskForm />);
        const backButton = await screen.findByLabelText('Go back');
        await userEvent.click(backButton);
        expect(mockBack).toHaveBeenCalled();
    });

    it('prevents submission if name is empty', async () => {
        render(<TaskForm />);
        const createButton = await screen.findByRole('button', { name: 'Create' });

        await userEvent.click(createButton);

        const nameInput = await screen.findByLabelText(/Name/i);
        expect(nameInput.validationMessage).not.toBe('');
    });

    it('calls createTask with correct data when form is filled', async () => {
        render(<TaskForm />);

        const nameInput = await screen.findByLabelText(/Name/i);
        const descriptionTextarea = await screen.findByLabelText(/Description/i);
        const projectSelect = await screen.findByLabelText(/Project/i);
        const createButton = await screen.findByRole('button', { name: 'Create' });

        await userEvent.type(nameInput, 'My New Task');
        await userEvent.type(descriptionTextarea, 'This is a description');
        await userEvent.selectOptions(projectSelect, "1");

        await userEvent.click(createButton);

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledTimes(1);
        });

        const formData = mockCreateTask.mock.calls[0][0];
        expect(formData.get('name')).toBe('My New Task');
        expect(formData.get('description')).toBe('This is a description');
        expect(formData.get('projectId')).toBe("1");
    });
});
