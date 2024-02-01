import { HttpResponse } from 'msw';

export const jsonOkResponse = (body: object | null) => {
  return HttpResponse.json(body);
};

export const noContentResponse = () => {
  return new HttpResponse(null, {
    status: 204,
  });
};

export const gatewayTimeoutResponse = (body?: object | null) => {
  return HttpResponse.json(body, { status: 504 });
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
  return new HttpResponse(
    '<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1"/>\n<title>Error 404 Not Found</title>\n</head>\n<body><h2>HTTP ERROR 404 Not Found</h2>\n<table>\n<tr><th>URI:</th><td>/application/api/hackathon/not-found-id</td></tr>\n<tr><th>STATUS:</th><td>404</td></tr>\n<tr><th>MESSAGE:</th><td>Not Found</td></tr>\n<tr><th>SERVLET:</th><td>jersey</td></tr>\n</table>\n\n</body>\n</html>\n',
    { status: 404 }
  );
};
