import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from '/src/app/events/form/page';

const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        back: mockBack
    }),
}));

const mockCreateEvent = jest.fn();
jest.mock('/src/app/events/form/action', () => ({
    createEvent: jest.fn((formData) => mockCreateEvent(formData)),
}));

describe('EventForm - Visual component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the main heading "Create Event"', () => {
        render(<EventForm />);
        expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    it('renders back button with aria-label "Go back"', () => {
        render(<EventForm />);
        expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });

    it('renders the name input as required', () => {
        render(<EventForm />);
        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeRequired();
    });

    it('renders the description textarea', () => {
        render(<EventForm />);
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });

    it('renders the submit button with text "Create"', () => {
        render(<EventForm />);
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('calls router.back() when clicking the back button', async () => {
        render(<EventForm />);
        const backButton = screen.getByLabelText('Go back');
        await userEvent.click(backButton);
        expect(mockBack).toHaveBeenCalled();
    });

    it('prevents submission if name is empty', async () => {
        render(<EventForm />);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.click(createButton);

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput.validationMessage).not.toBe('');
    });

    it('calls createEvent with correct data when form is filled', async () => {
        render(<EventForm />);

        const nameInput = screen.getByLabelText(/Name/i);
        const descriptionTextarea = screen.getByLabelText(/Description/i);
        const createButton = screen.getByRole('button', { name: 'Create' });

        await userEvent.type(nameInput, 'My New Event');
        await userEvent.type(descriptionTextarea, 'This is a description');

        await userEvent.click(createButton);

        expect(mockCreateEvent).toHaveBeenCalledTimes(1);

        const formData = mockCreateEvent.mock.calls[0][0];
        expect(formData.get('name')).toBe('My New Event');
        expect(formData.get('description')).toBe('This is a description');
    });

});
