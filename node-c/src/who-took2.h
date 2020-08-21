#ifndef WHO_TOOK2_H_
#define WHO_TOOK2_H_

#include <node_api.h>

#define JS_ASSERT(expr, msg)          \
  if (!(expr)) {                      \
    napi_throw_error(env, NULL, msg); \
    return NULL;                      \
  }

napi_value who_took2(napi_env env, napi_callback_info info);

#endif // WHO_TOOK2_H_
