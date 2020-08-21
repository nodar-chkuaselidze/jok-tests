#include <stdio.h>
#include <stdlib.h>
#include <node_api.h>
#include <napi-macros.h>
#include <jok.h>

#include "helpers.h"
#include "jok.h"
#include "who-took1.h"
#include "who-took2.h"

NAPI_INIT() {
  NAPI_EXPORT_FUNCTION(who_took1);
  NAPI_EXPORT_FUNCTION(who_took2);
}
