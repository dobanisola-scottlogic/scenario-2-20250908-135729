import { screen, waitFor } from '@testing-library/react';
import { renderWithRouterAndProvider } from '~/utils/test-utils';
import ViewInformation from './ViewInformation';
import { getTeamInfoNotFoundResponseHandler } from '~/mocks/handlers/team';
import { server } from '~/mocks/server';

const mockFunction = () => null;

describe('ViewInformation', () => {
  it('renders the ViewInformation popup correctly', () => {
    renderWithRouterAndProvider(
      <ViewInformation isOpen setIsOpen={mockFunction} />
    );

    expect(
      screen.getByRole('dialog', { name: 'Access information' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Use these details to access your development environment:'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Account ID' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'IAM user name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Password' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders the ViewInformation popup correctly when info is obtained', async () => {
    renderWithRouterAndProvider(
      <ViewInformation isOpen setIsOpen={mockFunction} />
    );

    const accountIdField: HTMLInputElement = screen.getByRole('textbox', { name: 'Account ID' });
    const userNameField: HTMLInputElement = screen.getByRole('textbox', { name: 'IAM user name' });
    const passwordField: HTMLInputElement = screen.getByRole('textbox', { name: 'Password' });
    const devEnvironmentLink: HTMLLinkElement = screen.getByRole('link');

    await waitFor(() => {
      expect(
        accountIdField.value
      ).toContain('0123456789');
      expect(
        userNameField.value
      ).toContain('test-user');
      expect(
        passwordField.value
      ).toContain('test-password');
      expect(devEnvironmentLink.href).toContain('https://test-url.com');
    });
  });

  it('closes the ViewInformation popup when the close button is clicked', () => {
    const setIsOpen = vi.fn();
    renderWithRouterAndProvider(
      <ViewInformation isOpen setIsOpen={setIsOpen} />
    );

    const closeButton: HTMLButtonElement = screen.getByRole('button', { name: 'Close' });

    closeButton.click();

    expect(setIsOpen).toHaveBeenCalled();
  });

  it('displays a message when the team information cannot be retrieved', async () => {
    server.use(getTeamInfoNotFoundResponseHandler);
    
    renderWithRouterAndProvider(
      <ViewInformation isOpen setIsOpen={mockFunction} />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('alert')
      ).toBeInTheDocument();
    });
  });
});
