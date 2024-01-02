/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 * File: invert_matrix.c
 *
 * MATLAB Coder version            : 5.4
 * C/C++ source code generated on  : 11-Nov-2023 01:32:18
 */

/* Include Files */
#include "invert_matrix.h"
#include <math.h>
#include <string.h>

/* Function Definitions */
/*
 * Arguments    : const double M[9]
 *                double Mi[9]
 * Return Type  : void
 */
void invert_matrix(const double M[9], double Mi[9])
{
  double x[9];
  double absx11;
  double absx21;
  double absx31;
  int p1;
  int p2;
  int p3;
  memcpy(&x[0], &M[0], 9U * sizeof(double));
  p1 = 0;
  p2 = 3;
  p3 = 6;
  absx11 = fabs(M[0]);
  absx21 = fabs(M[1]);
  absx31 = fabs(M[2]);
  if ((absx21 > absx11) && (absx21 > absx31)) {
    p1 = 3;
    p2 = 0;
    x[0] = M[1];
    x[1] = M[0];
    x[3] = M[4];
    x[4] = M[3];
    x[6] = M[7];
    x[7] = M[6];
  } else if (absx31 > absx11) {
    p1 = 6;
    p3 = 0;
    x[0] = M[2];
    x[2] = M[0];
    x[3] = M[5];
    x[5] = M[3];
    x[6] = M[8];
    x[8] = M[6];
  }
  x[1] /= x[0];
  x[2] /= x[0];
  x[4] -= x[1] * x[3];
  x[5] -= x[2] * x[3];
  x[7] -= x[1] * x[6];
  x[8] -= x[2] * x[6];
  if (fabs(x[5]) > fabs(x[4])) {
    int itmp;
    itmp = p2;
    p2 = p3;
    p3 = itmp;
    absx11 = x[1];
    x[1] = x[2];
    x[2] = absx11;
    absx11 = x[4];
    x[4] = x[5];
    x[5] = absx11;
    absx11 = x[7];
    x[7] = x[8];
    x[8] = absx11;
  }
  x[5] /= x[4];
  x[8] -= x[5] * x[7];
  absx11 = (x[1] * x[5] - x[2]) / x[8];
  absx21 = -(x[1] + x[7] * absx11) / x[4];
  Mi[p1] = ((1.0 - x[3] * absx21) - x[6] * absx11) / x[0];
  Mi[p1 + 1] = absx21;
  Mi[p1 + 2] = absx11;
  absx11 = -x[5] / x[8];
  absx21 = (1.0 - x[7] * absx11) / x[4];
  Mi[p2] = -(x[3] * absx21 + x[6] * absx11) / x[0];
  Mi[p2 + 1] = absx21;
  Mi[p2 + 2] = absx11;
  absx11 = 1.0 / x[8];
  absx21 = -x[7] * absx11 / x[4];
  Mi[p3] = -(x[3] * absx21 + x[6] * absx11) / x[0];
  Mi[p3 + 1] = absx21;
  Mi[p3 + 2] = absx11;
}

/*
 * Arguments    : void
 * Return Type  : void
 */
void invert_matrix_initialize(void)
{
}

/*
 * Arguments    : void
 * Return Type  : void
 */
void invert_matrix_terminate(void)
{
}

/*
 * File trailer for invert_matrix.c
 *
 * [EOF]
 */
