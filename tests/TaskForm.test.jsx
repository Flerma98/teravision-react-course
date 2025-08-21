import { render, screen } from '@testing-library/react';
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

describe('TaskForm - Visual component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the main heading "Create Task"', () => {
        render(<TaskForm />);
        expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    it('renders back button with aria-label "Go back"', () => {
        render(<TaskForm />);
        expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });

    it('renders the name input as required', () => {
        render(<TaskForm />);
        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders the description textarea', () => {
        render(<TaskForm />);
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });

    it('renders the submit button with text "Create"', () => {
        render(<TaskForm />);
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('calls router.back() when clicking the back button', async () => {
        render(<TaskForm />);
        const backButton = screen.getByLabelText('Go back');
        await userEvent.click(backButton);
        expect(mockBack).toHaveBeenCalled();
    });

    it('prevents submission if name is empty', async () => {
        render(<TaskForm />);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.click(createButton);

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput.validationMessage).not.toBe('');
    });

    it('calls createTask with correct data when form is filled', async () => {
        render(<TaskForm />);

        const nameInput = screen.getByLabelText(/Name/i);
        const descriptionTextarea = screen.getByLabelText(/Description/i);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.type(nameInput, 'My New Task');
        await userEvent.type(descriptionTextarea, 'This is a description');

        await userEvent.click(createButton);

        expect(mockCreateTask).toHaveBeenCalledTimes(1);

        const formData = mockCreateTask.mock.calls[0][0];
        expect(formData.get('name')).toBe('My New Task');
        expect(formData.get('description')).toBe('This is a description');
    });

});
