#ifndef __MYNETWORK_H__
#define __MYNETWORK_H__

class Tunnel
{
public:
	Tunnel();
	~Tunnel();
	void send(const char* in_mes);

private:
	int soc;
};

#endif // __MYNETWORK_H__
