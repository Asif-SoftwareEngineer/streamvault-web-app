import { HttpHeaders } from '@angular/common/http';

export const environment = {
  production: true,
  api: {
    baseUrl: 'https://stream-vault-server.herokuapp.com/v2/', //URL for API on Production Server
    serverUrl: 'https://stream-vault-server.herokuapp.com/',
    httpOptions: {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    },
  },
};
