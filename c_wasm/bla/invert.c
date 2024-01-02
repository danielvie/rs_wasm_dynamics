
#include <emscripten.h>
#include "invert_matrix.h"
#include "invert.h"
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
void invert(const double M[9], double out[9])
{
    // double* out = (double*)malloc(18 * sizeof(double));
    invert_matrix(M, out);
 
    // saving input values
    out[ 9] = -999;
    out[10] = M[0];
    out[11] = M[1];
    out[12] = M[2];
    out[13] = M[3];
    out[14] = M[4];
    out[15] = M[5];
    out[16] = M[6];
    out[17] = M[7];
    out[18] = M[8];
    // return out;
}

EMSCRIPTEN_KEEPALIVE
void _free(double* ptr) {
    free(ptr);
}

EMSCRIPTEN_KEEPALIVE
double* _malloc(int len) {
    return (double*)malloc(len*sizeof(double));
}