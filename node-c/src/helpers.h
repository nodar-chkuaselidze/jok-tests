#ifndef HELPERS_H_
#define HELPERS_H_

#include <node_api.h>
#include <stdio.h>

#define CARD_COLOR_MIN 0
#define CARD_COLOR_MAX 5

#define CARD_LEVEL_MIN 0
#define CARD_LEVEL_MAX 8

#define IS_CARD_COLOR(val) (val <= CARD_COLOR_MAX && val >= CARD_COLOR_MIN)
#define IS_CARD_LEVEL(val) (val <= CARD_LEVEL_MAX && val >= CARD_LEVEL_MIN)

#define DEBUG_LOG(...) do {     \
  fprintf(stderr, __VA_ARGS__); \
  fflush(stderr);               \
} while(0)

#define STR(n) #n

#define ASSERT_IS_ARRAY(env, val, err)                                   \
do {                                                                     \
  bool is_arr;                                                           \
  if (napi_is_array(env, val, &is_arr) != napi_ok) {                     \
    napi_throw_error(env, "EINVAL", "Expected array.");                  \
    return NULL;                                                         \
  }                                                                      \
  if (!is_arr) {                                                         \
    napi_throw_error(env, "EINVAL", err);                                \
    return NULL;                                                         \
  }                                                                      \
} while(0);

#define ASSERT_ARRAY_HAS_N_ELEMENTS(env, arr, n)                         \
do {                                                                     \
  uint32_t arr##_len;                                                    \
  napi_get_array_length(env, arr, &arr##_len);                           \
  if (arr##_len != n) {                                                  \
    napi_throw_range_error(                                              \
      env,                                                               \
      "EINLEN",                                                          \
      "Array must have "STR(n)" elements."                               \
    );                                                                   \
    return NULL;                                                         \
  }                                                                      \
} while(0)

#endif // HELPERS_H_
