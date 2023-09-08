import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import LoginTextField from './LoginTextField';

const mockOnChange = vi.fn();

describe('LoginTextField', () => {
  it('should render the LoginTextField component correctly when field is username', () => {
    renderWithProviders(
      <LoginTextField field="username" onChange={mockOnChange} />
    );

    expect(
      screen.getByRole('textbox', { name: 'Username' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'toggle password visibility' })
    ).not.toBeInTheDocument();
  });

  it('should render the LoginTextField component correctly when field is password', () => {
    renderWithProviders(
      <LoginTextField field="password" onChange={mockOnChange} />
    );

    // when password visibility is off, input type is password, role is not textbox so get by label
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'toggle password visibility' })
    ).toBeInTheDocument();
  });

  it('should show password when toggle password visibility button is clicked', () => {
    renderWithProviders(
      <LoginTextField field="password" onChange={mockOnChange} />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'toggle password visibility' })
    );

    // when password visibility is on, input type changes to text so role is now textbox
    expect(
      screen.getByRole('textbox', { name: 'Password' })
    ).toBeInTheDocument();
  });
});
