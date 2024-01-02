/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 * File: invert_matrix.h
 *
 * MATLAB Coder version            : 5.4
 * C/C++ source code generated on  : 11-Nov-2023 01:32:18
 */

#ifndef INVERT_MATRIX_H
#define INVERT_MATRIX_H

/* Include Files */
#include "rtwtypes.h"
#include <stddef.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Function Declarations */
extern void invert_matrix(const double M[9], double Mi[9]);

extern void invert_matrix_initialize(void);

extern void invert_matrix_terminate(void);

#ifdef __cplusplus
}
#endif

#endif
/*
 * File trailer for invert_matrix.h
 *
 * [EOF]
 */
