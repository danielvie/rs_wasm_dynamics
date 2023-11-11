#include <stdio.h>
#include "add.h"
#include "invert_matrix.h"

int main(int argc, char const *argv[])
{
	double dv[3];

	dv[0] = 2;
	dv[1] = 3;
	dv[2] = 5;
	dv[3] = 3;

    double* Mi = (double*)malloc(4 * sizeof(double));
	invert_matrix(dv, Mi);

	printf("invert: %f\n", Mi[0]);
	printf("invert: %f\n", Mi[1]);
	printf("invert: %f\n", Mi[2]);
	printf("invert: %f\n", Mi[3]);
	
	free(Mi);

	return 9;
}