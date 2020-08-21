#ifndef WHO_TOOK_H_
#define WHO_TOOK_H_

#include <node_api.h>
#include <napi-macros.h>

#define WT_GET_ELEMENT(array, index, res) do {          \
  napi_status el_status;                                \
  el_status = napi_get_element(env, array, index, res); \
  if (el_status != napi_ok)                             \
    return el_status;                                   \
} while(0)

#define WT_GET_PROPERTY(object, key, res) do {               \
  napi_status p_status;                                      \
  p_status = napi_get_named_property(env, object, key, res); \
  if (p_status != napi_ok)                                   \
    return p_status;                                         \
} while(0)

#define WT_GET_BOOL(val, name) do {               \
  napi_status b_status;                           \
  b_status = napi_get_value_bool(env, val, name); \
  if (b_status != napi_ok)                        \
    return b_status;                              \
} while(0)

#define WT_GET_INT32(val, name) do {                  \
  napi_status gu_status;                              \
  gu_status = napi_get_value_int32(env, val, name);   \
  if (gu_status != napi_ok)                           \
    return gu_status;                                 \
} while (0)

napi_value who_took1(napi_env env, napi_callback_info info);

#endif
