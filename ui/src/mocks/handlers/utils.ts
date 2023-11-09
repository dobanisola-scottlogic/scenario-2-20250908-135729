import { HttpResponse } from 'msw';

export const jsonOkResponse = (body: object | null) => {
  return HttpResponse.json(body);
};

export const noContentResponse = () => {
  return new HttpResponse(null, {
    status: 204,
  });
};

export const errorResponse = () => {
  return HttpResponse.error();
};

export const badRequestResponse = () => {
  return new HttpResponse(null, {
    status: 400,
  });
};

export const unauthorizedResponse = () => {
  return new HttpResponse('Credentials are required to access this resource.', {
    status: 401,
  });
};
