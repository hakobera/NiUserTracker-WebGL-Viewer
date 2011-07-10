#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include "SceneDrawer.h"
#include "network.h"

Tunnel::Tunnel()
{
  const char *dest = "127.0.0.1";
  unsigned short port = 8888;

  this->soc = socket(AF_INET, SOCK_STREAM, 0);

  struct sockaddr_in dest_addr;
  memset(&dest_addr, 0, sizeof(dest_addr));
  dest_addr.sin_family = AF_INET;
  dest_addr.sin_addr.s_addr = inet_addr(dest);
  dest_addr.sin_port = htons(port);

  if (connect(soc, (struct sockaddr *)&dest_addr, sizeof(dest_addr)) < 0) {
    fprintf(stderr, "connection error\n");
    return; // todo exception
  }

  printf("Connection success to web bridge server\n");
}

Tunnel::~Tunnel()       // can't call. glutMainLoop() is never end.
{
  close(this->soc);
}

void Tunnel::send(const char* in_mes)
{
  ::send(this->soc, in_mes, strlen(in_mes), SO_NOSIGPIPE);
}
