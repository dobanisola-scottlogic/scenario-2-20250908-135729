import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouterAndProvider } from '../../utils/test-utils';
import PasswordTextField from './PasswordTextField';

const mockOnChange = () => null;

describe('PasswordTextField', () => {
  it('should render an * on the password field label when the field is required', () => {
    renderWithRouterAndProvider(
      <PasswordTextField required value='' onChange={mockOnChange} />
    );

    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
  });

  it('should show password when toggle password visibility button is clicked', () => {
    renderWithRouterAndProvider(
      <PasswordTextField value='' onChange={mockOnChange} />
    );

    // when password visibility is off, input type is password, role is not textbox so get by label
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    // password is not yet visible
    expect(
      screen.queryByRole('textbox', { name: 'Password' })
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'toggle password visibility' })
    );

    // when password visibility is on, input type changes to text so role is now textbox
    expect(
      screen.getByRole('textbox', { name: 'Password' })
    ).toBeInTheDocument();
  });

  it('should render the PasswordTextField with a value when loaded with one', () => {
    renderWithRouterAndProvider(
      <PasswordTextField value='Password!1' onChange={mockOnChange} />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'toggle password visibility' })
    );

    expect(
      screen.getByRole('textbox', { name: 'Password' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveValue('Password!1');
  });
});
