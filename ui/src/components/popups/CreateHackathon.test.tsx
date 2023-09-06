import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateHackathon from './CreateHackathon';
import { renderWithProviders } from '../../utils/test-utils';

describe('Create Hackathon Popup Component', () => {

  const mockFunction = () => null;

  it('renders the create hackathon popup', () => {
    renderWithProviders(<CreateHackathon createHackathonOpen setCreateHackathonOpen={mockFunction} />);

    expect(screen.getByText('Add a new hackathon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })).toBeInTheDocument();
  });

  it('disables the add hackathon button until a name is entered', () => {
    renderWithProviders(<CreateHackathon createHackathonOpen setCreateHackathonOpen={mockFunction} />);

    expect(screen.getByText('Add a new hackathon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })).toHaveAttribute('disabled');
    const textInput = screen.getByRole('textbox', { name: 'Hackathon name' });

    fireEvent.change(textInput, {target: {value: 'Hackathon 1'}})

    expect(screen.getByRole('button', { name: 'ADD A NEW HACKATHON' })).not.toHaveAttribute('disabled');
  });
});