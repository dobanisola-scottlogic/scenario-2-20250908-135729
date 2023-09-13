import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    renderWithProviders(<Login />);
  });

  it('should render the Login component correctly', () => {
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Username' })
    ).toBeInTheDocument();
    // when password visibility is off, input type is password, role is not textbox so get by label
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'toggle password visibility' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('handles login with valid credentials correctly', async () => {
    // set credentials to testusername and testpassword to trigger 200 response from mock server
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'testusername' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('handles login with empty credentials correctly', () => {
    // check whitespace is trimmed from username and password
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('alert').textContent).toContain(
      'Username and password cannot be empty.'
    );
  });

  it('handles login with invalid credentials correctly', async () => {
    // set credentials to invalidusername and invalidpassword to trigger 401 response from mock server
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'invalidusername' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'invalidpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(
      'Invalid username or password. Please check your credentials.'
    );
  });

  it('handles login where server connection is refused correctly', async () => {
    // set credentials to networkerror to trigger network error response from mock server
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'networkerror' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'networkerror' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(
      "Sorry, we couldn't log you in. Please try again later."
    );
  });
});
