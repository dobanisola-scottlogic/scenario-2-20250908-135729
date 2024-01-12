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

export const badRequestResponse = (body?: object | null) => {
  return HttpResponse.json(body, { status: 400 });
};

export const unauthorizedResponse = () => {
  return HttpResponse.json(
    { error: 'Credentials are required to access this resource.' },
    { status: 401 }
  );
};

export const plainTextOkResponse = (body: string | null) => {
  return HttpResponse.text(body, { status: 200 });
};

export const notFoundResponse = () => {
  return new HttpResponse(null, { status: 404 });
};
