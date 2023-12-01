import { expect} from '@playwright/test';
import { Hackathon } from '~/interfaces/Hackathon';

// Currently this does not tear down anything as leaving everything
// until last causes test flakiness and failure. This will still be
// useful if, for example, a global setup with pre-made hackathons
// and teams is ever implemented.

async function globalTeardown() {
  const credentials = btoa("admin" + ':' + "secret");
  const basicAuth = `Basic ${credentials}`; 
   const getHackathons = await fetch(
      'http://localhost:8080/application/api/hackathon', {
        method: 'GET'
      }
    );
    expect(getHackathons.ok).toBeTruthy();
    if (getHackathons.status === 200) {
      const hackathons = await getHackathons.json() as Hackathon[];
      for (const hackathon of hackathons) {
        if (hackathon.id !== undefined) {
          const hackathonDeleteResponse = await fetch(
            `http://localhost:8080/application/api/hackathon/${hackathon.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': basicAuth
              }
            }
            );
            expect(hackathonDeleteResponse.status).toBe(204);
        }   
      }
    }
  }

  export default globalTeardown;