import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectForm from '/src/app/projects/form/page';

const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        back: mockBack
    }),
}));

const mockCreateProject = jest.fn();
jest.mock('/src/app/projects/form/action', () => ({
    createProject: jest.fn((formData) => mockCreateProject(formData)),
}));

describe('ProjectForm - Visual component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the main heading "Create Project"', () => {
        render(<ProjectForm />);
        expect(screen.getByText('Create Project')).toBeInTheDocument();
    });

    it('renders back button with aria-label "Go back"', () => {
        render(<ProjectForm />);
        expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });

    it('renders the name input as required', () => {
        render(<ProjectForm />);
        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders the description textarea', () => {
        render(<ProjectForm />);
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });

    it('renders the submit button with text "Create"', () => {
        render(<ProjectForm />);
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('calls router.back() when clicking the back button', async () => {
        render(<ProjectForm />);
        const backButton = screen.getByLabelText('Go back');
        await userEvent.click(backButton);
        expect(mockBack).toHaveBeenCalled();
    });

    it('prevents submission if name is empty', async () => {
        render(<ProjectForm />);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.click(createButton);

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput.validationMessage).not.toBe('');
    });

    it('calls createProject with correct data when form is filled', async () => {
        render(<ProjectForm />);

        const nameInput = screen.getByLabelText(/Name/i);
        const descriptionTextarea = screen.getByLabelText(/Description/i);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.type(nameInput, 'My New Project');
        await userEvent.type(descriptionTextarea, 'This is a description');

        await userEvent.click(createButton);

        expect(mockCreateProject).toHaveBeenCalledTimes(1);

        const formData = mockCreateProject.mock.calls[0][0];
        expect(formData.get('name')).toBe('My New Project');
        expect(formData.get('description')).toBe('This is a description');
    });

});
